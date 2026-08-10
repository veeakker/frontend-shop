import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'veeakker/config/environment';

export default class AboutRoute extends Route {
  @service router;

  activate() {
    if (config.mainSite.enabled === 'false') {
      this.router.transitionTo('/not-found');
    }
  }
}
