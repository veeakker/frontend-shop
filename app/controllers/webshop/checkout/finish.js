import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { BasketFetcher } from '../../../services/basket';
import { use } from 'ember-could-get-used-to-this';

export default class WebshopCheckoutController extends Controller {
  @use basket = new BasketFetcher(() => [this.fetchDate, this.model])
  @tracked fetchDate = new Date();

  @action
  refreshBasket(){
    this.fetchDate = new Date();
  }
}
