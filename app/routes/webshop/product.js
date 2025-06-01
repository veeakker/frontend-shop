import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopProductRoute extends Route {
  @service store

  model(params){
    return this.store.findRecord('product', params["product_id"], {
      include: "offerings.unit-price,offerings.type-and-quantity",
      reload: true
    });
  }

  setupController( controller ) {
    super.setupController( ...arguments );
    controller.resetOrder();
    controller.checkFavourite();
  }
}
