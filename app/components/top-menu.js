import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { get } from '@ember/object';
import config from 'veeakker/config/environment';

export default class TopMenuComponent extends Component {
  @service theme;
  @service session;

  @tracked
  mobileOpen = false;

  get mobileIsOpenClass() {
    return this.mobileOpen && "mobile-open";
  }

  get webshop() {
    return this.session.webshop ?? 'all';
  }

  get mainSiteEnabled() {
    return config.mainSite.enabled !== 'false';
  }

  get logoRoute() {
    return this.mainSiteEnabled ? 'overview' : 'webshop';
  }

  get topImageUrl() {
    const shop = this.session.webshop;
    if (shop) {
      const topImage = get(shop, 'topImage');
      if (topImage && topImage.get('id')) {
        return topImage.get('downloadUrl');
      }
    }
    return null;
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
