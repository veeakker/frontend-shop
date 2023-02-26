import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class WebshopCheckoutController extends Controller {
  @service basket
  @tracked currentDeliveryMethod;
  @service router

  get payDirectly() {
    return this.deliveryMethod == "postal";
  }

  get deliveryMethod() {
    switch (this.basket?.basket?.deliveryType) {
      case "http://veeakker.be/delivery-methods/postal":
        return "postal";
      case "http://veeakker.be/delivery-methods/tour":
        return "tour";
      case "http://veeakker.be/delivery-methods/shop":
        return "shop";
      default:
        return "tour";
    }
  }

  set deliveryMethod(method) {
    // postal tour shop false
    this.currentDeliveryMethod = method;

    if (method)
      this.basket.basket.deliveryType = `http://veeakker.be/delivery-methods/${method}`;
    else
      this.basket.basket.deliveryType = null;
  }

  @action
  async confirmOrder() {
    const basket = this.basket.basket;
    const basketId = basket.id;
    console.log(`Confirming basket ${basket.id}`);
    await this.basket.persistDeliveryInfo();
    await fetch(`/confirm-basket/${basketId}`, {
        method: "post",
        headers: {
          'Accept': 'application/vnd.api+json'
        }
      });
    await this.basket.reloadBasket();
    this.router.transitionTo("webshop.checkout.finish", basketId );
  }
}
