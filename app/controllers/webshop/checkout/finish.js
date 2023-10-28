import Controller from '@ember/controller';

export default class WebshopCheckoutController extends Controller {
  get basket() {
    return this.model.basket;
  }

  get totalCost() {
    return this.model.totalCost;
  }
}
