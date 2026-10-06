import { get } from '@ember/object';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class WebshopBasketRowComponent extends Component {
  @service basket;

  @tracked editing = false;
  @tracked confirmingRemoval = false;
  @tracked amount;
  @tracked selectedOffer;

  get productIsEnabled() {
    const product = get(this.args.orderLine, 'product');
    return product && get(product, 'isEnabled');
  }

  get offeringIsEnabled() {
    const offering = get(this.args.orderLine, 'offering');
    return offering && get(offering, 'isEnabled');
  }

  get availableForBasketLocation() {
    return get(this.args.orderLine, 'availableForBasketLocation');
  }

  get persistCommentFn() {
    return (orderLine) => this.persistComment(orderLine);
  }

  persistComment(orderLine) {
    this.basket.persistComment(orderLine, orderLine.comment);
  }

  @action
  requestRemoval() {
    if (this.args.confirmRemoval)
      this.confirmingRemoval = true;
    else
      this.args.removeOrderLine?.(this.args.orderLine.offering, this.args.orderLine.amount);
  }

  @action
  async startEditing() {
    // the async offering relationship reads back a proxy; await it so the
    // editor and Bevestig always work with a real record
    this.selectedOffer = await this.args.orderLine.offering;
    this.amount = this.args.orderLine.amount;
    this.editing = true;
  }

  @action
  cancelEditing() {
    this.editing = false;
  }

  @action
  pickQuantity(offers, value) {
    const offer = offers.find( (candidate) => get(candidate, 'typeAndQuantity.value') == value );
    if (offer)
      this.updateConfiguration(offer);
  }

  @action
  updateConfiguration(offer) {
    this.selectedOffer = offer;
  }

  @action
  updateAmount(amount) {
    this.amount = amount;
  }

  /**
    Applies the edited configuration to the order line.  This is an
    update: the saved state is the source of truth, the rest of the
    basket stays exactly as it was.
   */
  @action
  confirmEditing() {
    this.basket.updateOrderLine(this.args.orderLine, { amount: this.amount, offering: this.selectedOffer });
    this.editing = false;
  }

  @action
  cancelRemoval() {
    this.confirmingRemoval = false;
  }
}
