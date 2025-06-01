import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopContactInfoRoute extends Route {
  @service router;
  @service basket;
  @service session;

  @action
  async willTransition(/* transition */) {
    await this.basket.persistInvoiceInfo();
    // eslint-disable-next-line ember/no-controller-access-in-routes
    this.controller.showWarnings = false;
  }

  async activate() {
    if( this.session.isAuthenticated ) {
      // if we have an account, then we should already have merged the
      // basket and we should already have set the basket to belong to
      // the current user.

      // TODO: DRY with webshop/account
      // const account = await this.store.findRecord('account', this.session.data.authenticated.relationships.account.data.id, {include: "person"});
      // this.basket.basket.customer = account.person;
      // await this.basket.basket.save();
      this.router.transit("webshop.checkout.delivery");
    }
  }
}
