import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class WebshopBasketController extends Controller {
  @service basket
  @service checkoutRequirements

  get checkoutRoute() {
    return this.checkoutRequirements.firstUnsatisfiedStep?.route;
  }

  get checkoutLabel() {
    return this.checkoutRequirements.identityKnown
      ? 'Naar levering'
      : 'Naar contactgegevens';
  }

  @action
  removeOrderLine(offering, amount) {
    this.basket.removeOffer( offering, amount );
  }
}