import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class WebshopCheckoutController extends Controller {
  @service basket

  @action
  refreshBasket(){
    this.basket.basket.reload();
  }
}
