import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ProductsIndexRoute extends Route {
  @service router;
  activate() {
    later( () => this.router.transitionTo('products.beef') );
  }
}
