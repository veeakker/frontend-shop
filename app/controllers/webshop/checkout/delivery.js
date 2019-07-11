import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default class WebshopCheckoutController extends Controller {
  @service basket

  @computed( "deliveryMethod" )
  get payDirectly(){
    return this.deliveryMethod == "postal";
  }
}
