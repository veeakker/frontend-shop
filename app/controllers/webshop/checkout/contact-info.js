import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { notEmpty } from '../../../helpers/not-empty';

export default class WebshopCheckoutContactInfoController extends Controller {
  @service basket;
  @service session;
  @service router;

  @tracked showWarnings;
  @tracked isSaving = false;

  @action
  async persistAndContinue() {
    this.isSaving = true;
    try {
      if (this.session.isAuthenticated && this.model) {
        const { customer, postalAddress } = this.model;
        if (postalAddress) await postalAddress.save();
        await customer.save();
      } else {
        await this.basket.persistInvoiceInfo();
      }
      this.router.transitionTo('webshop.checkout.delivery');
    } finally {
      this.isSaving = false;
    }
  }

  get warnings() {
    const warnings = [];
    notEmpty(this.basket.get("basket.invoice.firstName")) || warnings.push("Voornaam is nodig voor het verwerken van de pakjes.");
    notEmpty(this.basket.get("basket.invoice.lastName")) || warnings.push("Achternaam is nodig voor het verwerken van de pakjes.");
    notEmpty(this.basket.get("basket.invoice.address.streetAddress")) || warnings.push("Straat en huisnummer zijn nodig voor leveringen.");
    notEmpty(this.basket.get("basket.invoice.address.postalCode")) || warnings.push("Postcode is nodig voor de levering.");
    notEmpty(this.basket.get("basket.invoice.address.locality")) || warnings.push("Gemeente is nodig voor de levering.");
    notEmpty(this.basket.get("basket.invoice.telephone")) || warnings.push("Telefoonnummer is nodig moest er iets mis lopen met de levering.");
    notEmpty(this.basket.get("basket.invoice.email")) || warnings.push("Email-adres is nodig voor informatie over de levering.");
    return warnings;
  }
}
