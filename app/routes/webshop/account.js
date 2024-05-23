import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopAccountRoute extends Route {
  @service() session;
  @service store

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(){
    const accounts = await this.store.query('account', { page: { size: 1 }, include: "person,person.postal-address" });
    const account = accounts.toArray()[0];
    return account;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.activate();
  }
}
