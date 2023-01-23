import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class WebshopCheckoutController extends Controller {
  @service basket
  @tracked currentDeliveryMethod;

  get payDirectly() {
    return this.deliveryMethod == "postal";
  }

  get deliveryMethod() {
    return this.currentDeliveryMethod;
  }

  set deliveryMethod(method) {
    // postal tour shop false
    this.currentDeliveryMethod = method;

    if (method)
      this.basket.basket.deliveryType = `http://veeakker.be/delivery-methods/${method}`;
    else
      this.basket.basket.deliveryType = null;

    this.basket.basket.save();
  }
}
