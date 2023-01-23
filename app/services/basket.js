import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';
import { use, Resource } from 'ember-could-get-used-to-this';
import { action } from '@ember/object';

class BasketFetcher extends Resource {
  @tracked value
  @service store

  async setup() {
    const result = await (await fetch(`/current-basket/ensure`)).json();
    this.store.pushPayload( result );
    const baskets = await this.store.query('basket', {
      ":id:": result.data.id,
      include: "order-lines.offering.type-and-quantity.product,order-lines.offering.unit-price"
    });
    this.value = baskets.firstObject;
  }

}

export default class BasketService extends Service {
  @service store
  @use basket = new BasketFetcher(() => true)

  @action
  setDeliveryPlace( deliveryPlace ) {
    this.basket.deliveryPlace = deliveryPlace;
  }

  get orderLines() {
    return this.basket?.orderLines;
  }

  async saveBasket(){
    await this.basket?.save();
  }

  /**
   * Adds <amount> items of type <offering> to the orderLines
   */
  async addOffer( offering, amount ){
    if( this.hasOffering( offering ) ) {
      const obj = this.objectForOffering( offering );
      obj.set( 'amount',  obj.amount + amount );
    } else {
      const orderLine = this.store.createRecord('order-line', { offering, amount });
      await orderLine.save();
      this.orderLines.pushObject(orderLine);
    }

    await this.saveBasket();
  }

  /**
   * Removes <amount> items of type <offering> from the orderLines.
   */
  removeOffer( offering, amount ){
    const obj = this.objectForOffering( offering );
    set(obj, 'amount', obj.amount - amount);
    if( obj.amount <= 0 ) {
      this.orderLines.removeObject( obj );
    }
    this.saveBasket();
  }

  objectForOffering( offering ) {
    return this.orderLines.findBy( "offering", offering );
  }

  hasOffering( offering ) {
    this.objectForOffering( offering ) && true;
  }

  get totalPrice() {
    // TODO: this could be a resource
    // sum all prices
    if( this.orderLines ){
      const orderLines = this.orderLines;
      const enabledOrderLines = orderLines.filter( (line) => get(line, "product.isEnabled") );
      const prices = enabledOrderLines.map( (ol) => get(ol, "price") || 0 );
      return prices.reduce( (a,b) => a+b, 0);
    }
    else return undefined;
  }
}
