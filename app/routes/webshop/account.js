import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WebshopAccountRoute extends Route {
  @service() session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params){
    console.log(this.session.data.authenticated.relationships.account.data.id)
    debugger;
    return await this.store.findRecord('account', this.session.data.authenticated.relationships.account.data.id);
  }
}
