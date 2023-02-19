import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopContactInfoRoute extends Route {
  @service basket;
  @service session;

  @action
  async willTransition(_transition) {
    this.basket.basket.deepPersist();
  }

  async activate() {
    if( this.session.isAuthenticated ) {
      // TODO: DRY with webshop/account
      const account = await this.store.findRecord('account', this.session.data.authenticated.relationships.account.data.id, {include: "person"});
      this.basket.basket.customer = account.person;
      await this.basket.basket.save();
      this.transitionTo("webshop.checkout.delivery");
    }
  }
}
