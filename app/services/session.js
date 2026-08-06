import Service from 'ember-simple-auth/services/session';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import ExternalPromise from 'veeakker/utils/external-promise';

export default class SessionService extends Service {
  @service store;
  @tracked _webshopPromise = new ExternalPromise();

  async init() {
    super.init(...arguments);
    const shops = await this.store.query('shop', { 'filter[:exact:slug]': 'all' });
    if (!this._webshopPromise.resolved) {
      this.webshop = shops[0];
    }
  }

  get webshop() {
    return this._webshopPromise.resolved;
  }

  get pWebshop() {
    return this._webshopPromise.promise;
  }

  set webshop(webshop) {
    this._webshopPromise.resolve(webshop);
    this._webshopPromise = new ExternalPromise();
    this._webshopPromise.resolve(webshop);
    if (webshop) {
      document.documentElement.setAttribute('data-shop', get(webshop, 'slug'));
    }
  }
}
