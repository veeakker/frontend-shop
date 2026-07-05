import Route from '@ember/routing/route';
import { scheduleOnce } from '@ember/runloop';

export default class WebshopBasketRoute extends Route {
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
}
