import Route from '@ember/routing/route';

export default class WebshopProductRoute extends Route {
  model(params){
    return this.store.loadRecord('product', params["product_id"], {
      include: "offerings.unit-price,offerings.type-and-quantity"
    });
  }

  setupController( controller ) {
    super.setupController( ...arguments );
    controller.resetOrder();
  }
}
