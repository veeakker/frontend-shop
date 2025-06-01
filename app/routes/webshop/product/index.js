import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductIndexRoute extends Route {
  @service router;
  activate() {
    this.router.transitionTo("webshop.product.information", this.modelFor('webshop.product'));
  }
}
