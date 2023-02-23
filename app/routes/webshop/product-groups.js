import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsRoute extends Route {
  @service store;

  model() {
    return this.store.query('product-group', { "filter[:has-no:parent-groups]": "yes", include: "child-groups" });
  }
}
