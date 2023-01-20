import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopCheckoutFinishRoute extends Route {
  @service store;

  model({basket_id}) {
    return this.store.find('basket', basket_id);
  }
}
