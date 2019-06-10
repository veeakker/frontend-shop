import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsShowSubgroupsShowRoute extends Route {
  @service store

  model( { subgroup_id } ) {
    return this.store.find( 'product-group', subgroup_id );
  }
}
