import { get } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { CONFIRMED } from 'veeakker/models/basket';

export default class WebshopBasketsShowController extends Controller {
  CONFIRMED = CONFIRMED;

  @service() basket

  get currentBasketOfferingIds() {
    return new Set(
      (this.basket.orderLinesR || []).map(line => line.belongsTo('offering').id()).filter(Boolean)
    );
  }

  @action
  isAlreadyInBasket(orderLine) {
    const id = orderLine.belongsTo('offering').id();
    return id && this.currentBasketOfferingIds.has(id);
  }

  @action
  addToBasket( orderLine ) {
    this.basket.addOffer( get(orderLine, "offering"), get(orderLine, "amount") );
  }
}
