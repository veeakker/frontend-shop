import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopCheckoutRoute extends Route {
  @service basket

  model() {
    return this.basket.pBasket;
  }
}
