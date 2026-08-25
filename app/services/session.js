import Service from 'ember-simple-auth/services/session';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class SessionService extends Service {
  @service store;
  @tracked _webshop;

  _initPromise;

  async init() {
    super.init(...arguments);
    this._initPromise = this._loadInitialShop();
  }

  async _loadInitialShop() {
    const shops = await this.store.query('shop', { 'filter[:exact:slug]': 'all' });
    if (!this._webshop) {
      this.webshop = shops[0];
    }
  }

  get webshop() {
    return this._webshop;
  }

  get pWebshop() {
    if (this._webshop) {
      return Promise.resolve(this._webshop);
    } else {
      return this._initPromise.then(() => this._webshop);
    }
  }

  set webshop(webshop) {
    this._webshop = webshop;
  }

  // Like BasketService.getConstrainingBusinessEntity.  shop.offerings is not set when no constraints are applied
  // (meaning all).  shopSearchParams finds own offerings via the search index.  deliveryPlaces, disallowedProductGroups
  // and suppliers serve as proxy constraints.
  async getConstrainingShop() {
    const shop = await this.pWebshop;
    if (shop) {
      const [deliveryPlaces, disallowedProductGroups, suppliers] = await Promise.all([
        get(shop, 'deliveryPlaces'),
        get(shop, 'disallowedProductGroups'),
        get(shop, 'suppliers')
      ]);
      if (deliveryPlaces.length || disallowedProductGroups.length || suppliers.length) {
        return shop;
      } else {
        return;
      }
    } else {
      return;
    }
  }
}
