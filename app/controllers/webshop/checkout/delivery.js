import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class WebshopCheckoutController extends Controller {
  @service basket
  @tracked deliveryMethod;

  get payDirectly(){
    return this.deliveryMethod == "postal";
  }
}
