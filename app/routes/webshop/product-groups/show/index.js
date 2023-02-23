import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopProductGroupsShowIndexRoute extends Route {
  @service router;

  async activate() {
    const topGroup = await this.controllerFor("webshop.product-groups.show").model;
    const childGroups = await topGroup.childGroups;
    const firstChildGroup = await childGroups.sortBy("sortIndex").firstObject;
    if( firstChildGroup.id && topGroup.id ) {
      this.router.transitionTo('webshop.product-groups.show.subgroups.show', firstChildGroup.id);
    } else {
      console.log({topGroup, childGroups: childGroups.toArray(), firstChildGroup});
    }
  }
}
