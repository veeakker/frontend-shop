import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopDeliveryRoute extends Route {
  @service basket;

  @action
  async willTransition(_transition) {
    this.basket.basket.deepPersist();
  }
}
