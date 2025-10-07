import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopProductGroupsShowIndexRoute extends Route {
  @service router;

  async activate() {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const childGroups = (await this.controllerFor("webshop.product-groups.show").model).children;
    const sortedChildGroups = [...childGroups].sort( (a,b) => a.sortIndex - b.sortIndex )[0]
    const firstChildGroup = sortedChildGroups.length && sortedChildGroups[0];
    if( firstChildGroup?.id ) {
      this.router.transitionTo('webshop.product-groups.show.subgroups.show', firstChildGroup.id);
    }
  }
}
