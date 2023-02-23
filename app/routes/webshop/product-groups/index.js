import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopProductGroupsIndexRoute extends Route {
  @service store;
  @service router;

  async activate() {
    const productGroups = await this.store.query('product-group', { "filter[:has-no:parent-groups]": "yes" });
    this.router.transitionTo("webshop.product-groups.show", productGroups.sortBy("sortIndex").firstObject);
  }
}
