import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'veeakker/config/environment';

export default class ApplicationRoute extends Route {
  @service session

  async beforeModel() {
    if (config.mainSite.enabled === 'false') {
      document.body.setAttribute('data-brand', 'generic');
    }
    await this.session.setup();
  }
}
