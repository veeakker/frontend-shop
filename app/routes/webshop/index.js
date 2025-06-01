import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopIndexRoute extends Route {
  @service router;

  activate() {
    this.router.transitionTo('webshop.product-groups');
  }
}
