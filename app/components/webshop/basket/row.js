import { get } from '@ember/object';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class WebshopBasketRowComponent extends Component {
  @service basket;

  @tracked confirmingRemoval = false;

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
  cancelRemoval() {
    this.confirmingRemoval = false;
  }
}
