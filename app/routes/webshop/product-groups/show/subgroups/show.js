import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsShowSubgroupsShowRoute extends Route {
  @service store

  model( { subgroup_id } ) {
    return this.store.loadRecord('product-group', subgroup_id, {
      include: "products.offerings.unit-price,products.offerings.type-and-quantity"
    });
  }
}
