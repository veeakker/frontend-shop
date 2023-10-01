import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Service from '@ember/service';
import  { use, Resource } from 'ember-could-get-used-to-this';

class BannersResource extends Resource {
  @service store;

  @tracked
  value = [];

  async setup() {
    // console.log(`Fetching banner on ${this.args.positional}`);
    const banners = await this.store.query('banner', { filter: { "is-enabled": true } });
    this.value = banners
      .filter( (b) => b.isEnabled)
      .sortBy( 'sortIndex' )
      .toArray();
  }

  update() {
    // console.log(`Upadting banner on ${this.args.positional}`);
  }
}

const fetchDate = new Date();

export default class BannerService extends Service {
  @use
  banners = new BannersResource( () => [fetchDate]);
}
