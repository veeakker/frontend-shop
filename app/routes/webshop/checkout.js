import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { scheduleOnce } from '@ember/runloop';

export default class WebshopCheckoutRoute extends Route {
  @service basket
  @service plausible

  model() {
    return this.basket.pBasket;
  }

  activate() {
    super.activate(...arguments);
    scheduleOnce('afterRender', this, () => {
      const el = document.querySelector('.checkout-progress');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY > top) {
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  }

  afterModel() {
    try {
      this.plausible.trackEvent('start-checkout');
    } catch (e) {
      console.warn(`Could not community with analytics ${e}`);
    }
  }
}
