import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class WebshopRoute extends Route {
  @service basket;
  @service session;
  @service store;
  @service router;

  serialize(webshop) {
    if (typeof webshop === 'string') return { shop_slug: webshop };
    return { shop_slug: webshop ? get(webshop, 'slug') : 'all' };
  }

  async model({ shop_slug }) {
    if (!shop_slug) {
      this.router.replaceWith('overview');
    } else if (this.session.webshop && get(this.session.webshop, 'slug') === shop_slug) {
      return this.session.webshop;
    } else {
      const shops = await this.store.query('shop', { 'filter[:exact:slug]': shop_slug });
      if (shops.length) {
        this.session.webshop = shops[0];
        return shops[0];
      } else {
        this.router.replaceWith('webshop-not-found');
      }
    }
  }
}
