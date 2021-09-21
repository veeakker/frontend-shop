import Route from '@ember/routing/route';

export default class WebshopProductInformationRoute extends Route {
  model(){
    return this.modelFor("webshop.product");
  }
}
