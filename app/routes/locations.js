import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class LocationsRoute extends Route {
  @service store;

  model(){
    return this.store.query('delivery-place', { include: "delivery-kind,geo-coordinate.postal-address,postal-address", "page[size]": 250 });
  }
}
