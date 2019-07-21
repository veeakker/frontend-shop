import { defineProperty } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { uriForNormalizedLabel } from 'veeakker/models/delivery-kind';
import { task } from 'ember-concurrency';

export default class WebshopCheckoutDeliveryLocationsMap extends Component {
  @service store

  locations = null;

  shownLocationName = null;

  init(){
    super.init(...arguments);
    // TODO: migrate to ember-concurrency-decorator once that's in a
    // stable and usable state.
    defineProperty( this, 'fetchLocations', task( function*(){
      const allPlaces = yield this.store.loadRecords('delivery-place', {
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
    } ).restartable() );
  }

  didReceiveAttrs(){
    if( this.locationName != this.shownLocationName ) {
      this.shownLocationName = this.locationName;
      this.fetchLocations.perform();
    }
  }

}
