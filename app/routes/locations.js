import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class LocationsRoute extends Route {
  @service store;

  model(){
    if( this.store.peekAll('delivery-place') ){
      // fetches when it needs to be refreshed or is incomplete.
      return this.store.findAll('delivery-place');
    } else {
      return this.store.query('delivery-place', { include: "delivery-kind,geo-coordinate.postal-address,postal-address", limit: 250 });
    }
  }
}
