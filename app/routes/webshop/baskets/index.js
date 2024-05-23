import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopBasketsIndexRoute extends Route {
  @service store;

  async model(page) {
    return await this.store.query('basket', { page: { number: page }, sort: "-status-changed-at" });
  }
}
