import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopDeliveryRoute extends Route {
  @service basket;
  @service plausible;

  @action
  async willTransition(transition) {
    if( transition.to.name !== "webshop.checkout.finish" ) {
      await this.basket.persistDeliveryInfo();
    } else {
      try {
        this.plausible.trackEvent('finish-checkout');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Could not log finish event ${e}`);
      }
    }
  }
}
