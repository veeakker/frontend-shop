import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
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
  @tracked allPlaces = [];

  constructor() {
    super(...arguments);
    this.loadPlaces();
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

  async loadPlaces() {
    this.allPlaces = await this.store.query('delivery-place', {
      include: "delivery-kind,geo-coordinate.postal-address,postal-address",
      "page[size]": 500,
      "filter[is-enabled]": true
    });
  }
}
