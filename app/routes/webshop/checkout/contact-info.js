import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { set } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopContactInfoRoute extends Route {
  @service basket;
  @service session;
  @service store;

  async model() {
    if (this.session.isAuthenticated) {
      try {
        const basket = await this.basket.pBasket;
        const customer = await basket.customer;
        if (customer) {
          let postalAddress = await customer.postalAddress;
          if (!postalAddress) {
            postalAddress = this.store.createRecord('postal-address');
            set(customer, 'postalAddress', postalAddress);
          }
          return { customer, postalAddress };
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    } else {
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