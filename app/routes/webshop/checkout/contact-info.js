import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopContactInfoRoute extends Route {
  @service basket;

  @action
  async willTransition(_transition) {
    this.basket.basket.deepPersist();
  }
}
