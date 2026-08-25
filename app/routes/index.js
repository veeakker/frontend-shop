import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'veeakker/config/environment';

const KIND_LABELS = {
  'butchery':      'Winkel',
  'health-shops':  'Natuurwinkel',
  'local-farms':   'Buurderij',
  'routes':        'Toer',
  'home-delivery': 'Aan huis'
};

export default class IndexRoute extends Route {
  @service router;
  @service session;
  @service store;

  async activate() {
    if (config.mainSite.enabled !== 'false') {
      const webshop = await this.session.pWebshop;
      this.router.transitionTo("webshop", webshop);
    }
  }

  async model() {
    if (config.mainSite.enabled === 'false') {
      const shops = await this.store.findAll('shop', {
        include: 'delivery-places.delivery-kind',
        reload: true
      });
      const deliveryPlaces = await this.store.query('delivery-place', {
        include: 'delivery-kind,geo-coordinate.postal-address,postal-address',
        'page[size]': 500,
        'filter[is-enabled]': true
      });
      const shopsWithKinds = [];
      for (const shop of shops.toArray()) {
        if (shop.slug === 'all') continue;
        const places = await shop.deliveryPlaces;
        const kindSet = new Set();
        for (const place of places.toArray()) {
          const kind = await place.deliveryKind;
          if (kind) kindSet.add(kind.normalizedLabel);
        }
        const kinds = [...kindSet];
        shopsWithKinds.push({
          shop,
          kinds,
          kindLabels: kinds.map((k) => KIND_LABELS[k]).filter(Boolean)
        });
      }
      return { shops: shopsWithKinds, deliveryPlaces: deliveryPlaces.toArray() };
    }
    return null;
  }
}
