import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  @service router;
  @service session;
  async activate() {
    const webshop = await this.session.pWebshop;
    this.router.transitionTo("webshop", webshop);
  }
}
