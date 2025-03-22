import { get } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { CONFIRMED } from 'veeakker/models/basket';

export default class WebshopBasketsShowController extends Controller {
  CONFIRMED = CONFIRMED;

  @service() basket

  @action
  addToBasket( orderLine ) {
    this.basket.addOffer( get(orderLine, "offering"), get(orderLine, "amount") );
  }
}
