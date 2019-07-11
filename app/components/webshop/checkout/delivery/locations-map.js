import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { uriForNormalizedLabel } from 'veeakker/models/delivery-kind';

export default class WebshopCheckoutDeliveryLocationsMap extends Component {
  @service store

  locations = null;

  shownLocationName = null;

  didReceiveAttrs(){
    if( this.locationName != this.shownLocationName ) {
      this.shownLocationName = this.locationName;
      this.fetchLocations();
    }
  }

  @action
  async fetchLocations() {
    const allPlaces = await this.store.loadRecords('delivery-place', {
      include: "delivery-kind,geo-coordinate.postal-address,postal-address",
      "page[size]": 250
    });

    let allowedTypes = [];
    // TODO: is this split correct? first is pickup when we want, the
    // other is when they want.
    if( this.shownLocationName == "tour" ){
      allowedTypes = [uriForNormalizedLabel( "routes" ),
                      uriForNormalizedLabel( "local-farms" )];
    } else if( this.shownLocationName == "shop" ) {
      allowedTypes = [uriForNormalizedLabel( "health-shops" )];
    }

    this.set(
      'locations',
      allPlaces.filter(
        (place) => allowedTypes.includes( place.get('deliveryKind.uri') ) ) );
  }
}
