import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopCheckoutRoute extends Route {
  @service basket
  @service plausible

  model() {
    return this.basket.pBasket;
  }

  afterModel() {
    try {
      this.plausible.trackEvent('start-checkout');
    } catch (e) {
      console.warn(`Could not community with analytics ${e}`);
    }
  }
}
