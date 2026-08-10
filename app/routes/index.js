import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'veeakker/config/environment';

export default class IndexRoute extends Route {
  @service router;
  @service session;
  async activate() {
    if (config.mainSite.enabled === 'false') {
      this.router.transitionTo('/not-found');
    } else {
      const webshop = await this.session.pWebshop;
      this.router.transitionTo("webshop", webshop);
    }
  }
}
