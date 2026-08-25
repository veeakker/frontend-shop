import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const KINDS = [
  { id: 'all',            label: 'Alle winkels' },
  { id: 'butchery',       label: 'Winkels' },
  { id: 'health-shops',   label: 'Natuurwinkels' },
  { id: 'local-farms',    label: 'Buurderijen' },
  { id: 'routes',         label: 'Toeren' },
  { id: 'home-delivery',  label: 'Aan huis' }
];

export default class IndexController extends Controller {
  @service session;

  @tracked kind = 'all';

  kinds = KINDS;

  get hostingShop() {
    const shop = this.session.webshop;
    if (!shop || typeof shop === 'string') {
      return null;
    }
    if (shop.slug === 'all') {
      return null;
    }
    return shop;
  }

  get filteredShops() {
    const kind = this.kind;
    const shops = this.model?.shops ?? [];
    if (kind === 'all') return shops;
    return shops.filter((entry) => entry.kinds.includes(kind));
  }

  @action
  setKind(kind) {
    this.kind = kind;
  }
}
