import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { use, Resource } from 'ember-could-get-used-to-this';
import { uriForNormalizedLabel } from 'veeakker/models/delivery-kind';
import wait from '../../../../utils/wait';

class LocationsFilterResource extends Resource {
  @tracked value = [];

  async setup() {
    const [places,acceptedLabels] = this.args.positional;
    const allowedKinds = acceptedLabels
          .map( (label) => uriForNormalizedLabel(label) )
          .uniq();

    await wait(1);

    this.value = places.filter((place) => {
      return allowedKinds.includes(place.get('deliveryKind.uri'))
        && place.isEnabled;
    });
  }
}

export default class WebshopCheckoutDeliveryLocationsMap extends Component {
  @service store
  @service basket
  @tracked allPlaces = [];
  @tracked userLocation = null;
  @tracked focusedLocation = null;
  @tracked _justSelectedId = null;

  constructor() {
    super(...arguments);
    this.loadPlaces();
    this.requestUserLocation();
  }

  @use
  locations = new LocationsFilterResource(() => [this.allPlaces, [this.locationLabel]]);

  get locationLabel() {
    switch (this.args.locationName) {
      case "tour":
        return "routes";
      case "shop":
        return "health-shops";
    }

    return null;
  }

  get sortedLocations() {
    const places = [...(this.locations || [])];
    if (!this.userLocation) return places;
    return places.sort((a, b) => this.distanceTo(a) - this.distanceTo(b));
  }

  @action
  distanceTo(place) {
    if (!this.userLocation) return Infinity;
    const loc = place.geoCoordinate?.get('location');
    if (!loc) return Infinity;
    const [ulat, ulng] = this.userLocation;
    const dlat = parseFloat(loc[0]) - ulat;
    const dlng = (parseFloat(loc[1]) - ulng) * Math.cos(ulat * Math.PI / 180);
    return Math.round(Math.sqrt(dlat * dlat + dlng * dlng) * 111);
  }

  get selectedPlaceId() {
    return this.basket.basket?.deliveryPlace?.id;
  }

  @action
  focusPlace(place) {
    this.focusedLocation = place.geoCoordinate?.get('location') || null;
  }

  @action
  selectFromList(place) {
    this.focusedLocation = place.geoCoordinate?.get('location') || null;
    this.args.select(place);
  }

  @action
  selectPlace(location) {
    this._justSelectedId = location.id;
    this.args.select(location);
    next(this, () => { this._justSelectedId = null; });
  }

  async loadPlaces() {
    this.allPlaces = await this.store.query('delivery-place', {
      include: "delivery-kind,geo-coordinate.postal-address,postal-address",
      "page[size]": 500,
      "filter[is-enabled]": true
    });
  }

  async requestUserLocation() {
    const geocoded = await this.geocodeBasketAddress();
    if (geocoded) this.userLocation = geocoded;
  }

  async geocodeBasketAddress() {
    try {
      const basketModel = await this.basket.pBasket;
      if (!basketModel) return null;

      // Read relationship IDs directly from the basket record (no extra fetch).
      // For logged-in users the backend sets customer; guests have invoiceAddress.
      const customerId = basketModel.belongsTo('customer').id();
      const invoiceAddressId = basketModel.belongsTo('invoiceAddress').id();

      let postalAddress = null;

      if (customerId) {
        const person = await this.store.findRecord('person', customerId, {
          include: 'postal-address'
        });
        postalAddress = await person.postalAddress;
      } else if (invoiceAddressId) {
        const invoiceAddress = await this.store.findRecord('full-address', invoiceAddressId, {
          include: 'postal-address'
        });
        postalAddress = await invoiceAddress.postalAddress;
      }

      if (!postalAddress) return null;

      const { streetAddress, postalCode, locality } = postalAddress;
      if (!postalCode && !locality) return null;

      const q = [streetAddress, postalCode, locality].filter(Boolean).join(', ');
      const url = 'https://nominatim.openstreetmap.org/search?' +
        new URLSearchParams({ q, format: 'json', limit: '1', countrycodes: 'be' });

      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Veeakker/1.0 (veeakker.be)' }
      });
      const [result] = await resp.json();
      if (result) return [parseFloat(result.lat), parseFloat(result.lon)];
    } catch (e) {
      console.warn('[location] address geocoding failed:', e.message);
    }
    return null;
  }
}
