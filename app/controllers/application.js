import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { use, Resource } from 'ember-could-get-used-to-this';
import config from 'veeakker/config/environment';

class ShopResource extends Resource {
  @tracked value = { slug: null, style: null, label: null };

  setup() {
    const shop = this.args.positional[0];
    if (!shop || typeof shop === 'string') {
      this.value = { slug: shop || 'all', style: null, label: shop || 'all' };
    } else {
      this.value = {
        slug: get(shop, 'slug'),
        style: get(shop, 'style'),
        label: get(shop, 'label')
      };
    }
  }
}

export default class ApplicationController extends Controller {
  @service session;

  @use shop = new ShopResource(() => [this.session.webshop]);

  get goedgekozenEnabled() {
    return config.mainSite.enabled === 'false' && config.marketplaceBrand === 'goedgekozen';
  }

  get brand() {
    if (config.mainSite.enabled === 'false') {
      return config.marketplaceBrand || 'generic';
    } else {
      return null;
    }
  }
}
