import Route from '@ember/routing/route';

export default class WebshopProductIngredientsRoute extends Route {
  model(){
    return this.modelFor("webshop.product");
  }
}
