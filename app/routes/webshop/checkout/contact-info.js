import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { set } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopContactInfoRoute extends Route {
  @service router;
  @service basket;
  @service session;
  @service store;

  async beforeModel(transition) {
    if (this.session.isAuthenticated) {
      const from = transition.from?.name ?? '';
      if (!from.startsWith('webshop.checkout')) {
        this.router.transitionTo('webshop.checkout.delivery');
      }
    }
  }

  async model() {
    if (!this.session.isAuthenticated) return null;
    try {
      const basket = await this.basket.pBasket;
      const customer = await basket.customer;
      if (!customer) return null;
      let postalAddress = await customer.postalAddress;
      if (!postalAddress) {
        postalAddress = this.store.createRecord('postal-address');
        set(customer, 'postalAddress', postalAddress);
      }
      return { customer, postalAddress };
    } catch (e) {
      return null;
    }
  }

  @action
  async willTransition(/* transition */) {
    if (!this.session.isAuthenticated) {
      await this.basket.persistInvoiceInfo();
    }
    // eslint-disable-next-line ember/no-controller-access-in-routes
    this.controller.showWarnings = false;
  }
}
