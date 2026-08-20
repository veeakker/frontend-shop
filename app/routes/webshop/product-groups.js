import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopProductGroupsRoute extends Route {
  @service store;
  @service basket;
  @service session;

  async model() {
    let businessEntity = await this.basket.getConstrainingBusinessEntity();
    let shop = await this.session.getConstrainingShop();

    return await this.store.query('product-group', {
      "filter[:has-no:parent-groups]": "yes",
      "filter[child-groups][products][is-enabled]": true,
      "include": "child-groups",
      ...businessEntity ? { "filter[child-groups][products][offerings][available-at-or-from][:id:]": businessEntity.id } : {},
      ...shop ? { "filter[child-groups][products][offerings][available-in-shop][:id:]": shop.id } : {}
    });
  }
}
