import Route from '@ember/routing/route';

export default class WebshopProductSupplierRoute extends Route {
  model(){
    return this.modelFor("webshop.product");
  }
}
