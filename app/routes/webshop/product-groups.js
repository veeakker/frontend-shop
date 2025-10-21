import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsRoute extends Route {
  @service store;
  @service basket;

  async model() {
    let businessEntity = await this.basket.getConstrainingBusinessEntity();

    return await this.store.query('product-group', {
      "filter[:has-no:parent-groups]": "yes",
      "include": "child-groups",
      ...businessEntity ? { "filter[child-groups][products][offerings][available-at-or-from][:id:]": businessEntity.id } : {}
    });
  }
}
