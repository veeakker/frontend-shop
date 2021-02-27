import { get } from '@ember/object';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Service from '@ember/service';
import { alias } from '@ember/object/computed';
import fetch from 'fetch';

export default class BasketService extends Service {
  @service store

  async init(){
    super.init(...arguments);

    const result = await (await fetch(`/current-basket/ensure`)).json();
    this.store.pushPayload( result );
    const basket = this.store.peekRecord('basket', result.data.id);
    await basket.reload();
    await basket.orderLines;
    this.set('basket', basket);
  }

  basket = null;

  @alias( 'basket.orderLines' )
  orderLines;

  async saveBasket(){
    await this.basket.save();
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

  @computed( 'orderLines.@each.price', 'orderLines.@each.product' )
  get totalPrice() {
    // sum all prices
    if( this.orderLines ){
      return this
        .orderLines
        .filter( (line) => get(line, 'product.isEnabled') )
        .map( (ol) => ol.price )
        .reduce( (a,b) => a+b, 0 );
    }
    else return undefined;
  }
}
