import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import productGroupHasProducts from 'veeakker/utils/product-group-has-products';
import shopSearchParams from 'veeakker/utils/shop-search-params';

export default class WebshopProductGroupsShowRoute extends Route {
  @service store;
  @service basket;
  @service session;
  @service router;

  async model(params) {
    let businessEntity = await this.basket.getConstrainingBusinessEntity();
    let shop = await this.session.getConstrainingShop();
    let shopParams = await shopSearchParams(shop);

    let allChildren = await this.store.query('product-group', {
      "filter[parent-groups][:id:]": params.id,
    });

    let checks = await Promise.all(
      allChildren.toArray().map(async (child) => ({
        child,
        hasProducts: await productGroupHasProducts(child.id, businessEntity, shopParams)
      }))
    );

    return {
      children: checks.filter(c => c.hasProducts).map(c => c.child),
      parent: await this.store.findRecord('product-group', params.id)
    };
  }
}
