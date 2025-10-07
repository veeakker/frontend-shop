import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopRoute extends Route {
  @service store;
  @service basket;

  async model() {
    let businessEntity = await this.basket.getBusinessEntity();

    return await this.store.query('product-group', {
      "filter[:has-no:parent-groups]": "yes",
      "filter[child-groups][products][offerings][available-at-or-from][:id:]": businessEntity ? businessEntity.id : undefined,
      "include": "child-groups"
    });
  }
}
