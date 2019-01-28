import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default class ProductsIndexRoute extends Route {
  activate() {
    later( () => this.transitionTo('products.beef') );
  }
}
