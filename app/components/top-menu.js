import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { get } from '@ember/object';
import { use, Resource } from 'ember-could-get-used-to-this';
import config from 'veeakker/config/environment';

class ShopHeaderResource extends Resource {
  @tracked value = { shop: 'all', label: 'all', logoUrl: null, topImageUrl: null };

  async setup() {
    const shop = this.args.positional[0];
    if (!shop || typeof shop === 'string') {
      this.value = {
        shop: shop || 'all',
        label: shop || 'all',
        logoUrl: null,
        topImageUrl: null
      };
      return;
    }

    const logo = await get(shop, 'logo');
    const topImage = await get(shop, 'topImage');

    let logoUrl = null;
    let topImageUrl = null;

    if (logo && get(logo, 'id')) {
      logoUrl = logo.sizedImageUrl({ width: 400 });
    }
    if (topImage && get(topImage, 'id')) {
      // width-only: service scales without cropping; CSS cover + top keep the top.
      topImageUrl = topImage.sizedImageUrl({ width: 1600 });
    }

    this.value = {
      shop,
      label: get(shop, 'label'),
      logoUrl,
      topImageUrl
    };
  }
}

export default class TopMenuComponent extends Component {
  @service theme;
  @service session;
  @service router;

  @tracked mobileOpen = false;

  @use shopHeader = new ShopHeaderResource(() => [this.session.webshop]);

  get mobileIsOpenClass() {
    return this.mobileOpen && "mobile-open";
  }

  get mainSiteEnabled() {
    return config.mainSite.enabled !== 'false';
  }

  get goedgekozenEnabled() {
    return config.mainSite.enabled === 'false' && config.marketplaceBrand === 'goedgekozen';
  }

  get onShopPage() {
    return (this.router.currentRouteName || '').startsWith('webshop');
  }

  get logoRoute() {
    if (this.goedgekozenEnabled) return 'index';
    return this.mainSiteEnabled ? 'overview' : 'webshop';
  }

  @action
  openNav(event){
    event.preventDefault();
    this.mobileOpen = true;
  }

  @action
  closeNav(event){
    event.preventDefault();
    this.mobileOpen = false;
  }
}
