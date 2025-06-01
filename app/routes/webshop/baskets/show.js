import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopBasketsShowRoute extends Route {
  @service() store;

  async model({basket_id}){
    return await this.store.findRecord('basket', basket_id);
  }
}
