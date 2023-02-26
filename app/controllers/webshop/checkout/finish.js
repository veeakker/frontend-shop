import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { BasketFetcher } from '../../../services/basket';
import { use, Resource } from 'ember-could-get-used-to-this';

class BasketTotalPrice extends Resource {
  @tracked value

  async setup() {
    let totalPrice = 0;
    let foundPrice = false;
    let basket = await this.args.positional[0];
    if ( basket ) {
      for (let orderLine of (await basket.orderLines).toArray()) {
        orderLine = await orderLine;
        let offering = await orderLine.offering;
        let unitPrice = await offering.unitPrice;
        if (unitPrice) {
          foundPrice = true;
          totalPrice += unitPrice.value + orderLine.amount;
        }
      }
    }
    this.value = foundPrice ? totalPrice : null;
  }
}

export default class WebshopCheckoutController extends Controller {
  get basket() {
    return this.model.basket;
  }

  get totalCost() {
    return this.model.totalCost;
  }



  // @use basket = new BasketFetcher(() => [this.fetchDate, this.model])
  // @tracked fetchDate = new Date();

  // @action
  // refreshBasket(){
  //   this.fetchDate = new Date();
  // }

  // @use totalPrice = new BasketTotalPrice( () => [this.basket] )

  // get totalPrice() {
  //   console.log(`Calculating price for basket ${this.basket?.id}`);
  //   const enabledOrderLines = (this.basket?.orderLines || []).filter( (line) => get(line, "product.isEnabled") );
  //   const prices = enabledOrderLines.map( (ol) => get(ol, "price") || 0 );
  //   return prices.reduce( (a,b) => a+b, 0);
  // }
}
