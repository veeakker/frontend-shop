import Route from '@ember/routing/route';

export default class WebshopIndexRoute extends Route {
  activate() {
    this.transitionTo('webshop.product-groups');
  }
}
