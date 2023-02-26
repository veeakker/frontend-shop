import Route from '@ember/routing/route';

export default class WebshopProductIndexRoute extends Route {
  activate() {
    this.transitionTo("webshop.product.information", this.modelFor('webshop.product'));
  }
}
