import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsShowRoute extends Route {
  @service store;
  @service basket;
  @service router;

  async model(params) {
    let businessEntity = await this.basket.getConstrainingBusinessEntity();

    return {
        children: await this.store.query('product-group', {
          "filter[parent-groups][:id:]": params.id,
          "filter[products][is-enabled]": true,
          ...businessEntity ? { "filter[products][offerings][available-at-or-from][:id:]": businessEntity.id } : {}
        }),
        parent: await this.store.findRecord('product-group', params.id)
    }
  }

  async afterModel() {
    super.afterModel(...arguments);
    const isCurrentRoute =
          this.router.currentRouteName == this.routeName
            || this.router.currentRouteName == this.routeName + ".index";
    if ( isCurrentRoute ) {
      const productGroups = (await this.controllerFor("webshop.product-groups.show").model).children;
      const sortedProductGroups = [...productGroups].sort( (a,b) => a.sortIndex - b.sortIndex );
      if (sortedProductGroups.length)
        this.router.transitionTo("webshop.product-groups.show.subgroups.show", sortedProductGroups[0].id);
    }
  }
}
