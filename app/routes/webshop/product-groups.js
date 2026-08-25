import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import productGroupHasProducts from 'veeakker/utils/product-group-has-products';
import shopSearchParams from 'veeakker/utils/shop-search-params';

export default class WebshopProductGroupsRoute extends Route {
  @service store;
  @service basket;
  @service session;

  async model() {
    let businessEntity = await this.basket.getConstrainingBusinessEntity();
    let shop = await this.session.getConstrainingShop();
    let shopParams = await shopSearchParams(shop);

    let rootGroups = await this.store.query('product-group', {
      "filter[:has-no:parent-groups]": "yes",
      "include": "child-groups",
    });

    let rootChecks = await Promise.all(
      rootGroups.toArray().map(async (root) => {
        let children = (await root.childGroups).toArray();
        let childChecks = await Promise.all(
          children.map(child => productGroupHasProducts(child.id, businessEntity, shopParams))
        );
        return { root, hasNonEmptyChild: childChecks.some(Boolean) };
      })
    );

    return rootChecks.filter(r => r.hasNonEmptyChild).map(r => r.root);
  }
}
