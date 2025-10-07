import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopProductGroupsIndexRoute extends Route {
  @service store;
  @service router;

  async activate() {
    const productGroups = (await this.controllerFor("webshop.product-groups")).model;
    const sortedProductGroups = [...productGroups].sort( (a,b) => a.sortIndex - b.sortIndex );
    if (sortedProductGroups.length)
      this.router.transitionTo("webshop.product-groups.show", sortedProductGroups[0].id);
  }
}
