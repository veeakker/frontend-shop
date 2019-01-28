import Route from '@ember/routing/route';

export default class ProductsIndexRoute extends Route {
  activate() {
    this.transitionTo('products.beef');
  }
}
