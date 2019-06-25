import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Service from '@ember/service';
import { alias } from '@ember/object/computed';

class OrderLine {
  constructor( { amount, offering } ) {
    this.amount = amount;
    this.offering = offering;
  }

  @computed( 'amount', 'offering.unitPrice.value' )
  get price() {
    // we don't use defaults here, as an NaN or undefined price is
    // probably preferred over an incorrect one.
    const amount = this.amount;
    const price = get(this, 'offering.unitPrice.value');
    return amount * price;
  }

  @alias( 'offering.unitPrice.value' ) pricePerUnit;
}

export default class BasketService extends Service {
  @service store

  init(){
    super.init(...arguments);
    this.orderLines = A();
  }

  orderLines = null;
  
  /**
   * Adds <amount> items of type <offering> to the orderLines
   */
  addOffer( offering, amount ){
    if( this.hasOffering( offering ) ) {
      const obj = this.objectForOffering( offering );
      obj.set( 'amount',  obj.amount + amount );
    } else {
      this.orderLines.pushObject(
        new OrderLine({ offering, amount })
      );
    }
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
  }

  objectForOffering( offering ) {
    return this.orderLines.findBy( "offering", offering );
  }

  hasOffering( offering ) {
    this.objectForOffering( offering ) && true;
  }

  @computed( 'orderLines.@each.price' )
  get totalPrice() {
    // sum all prices
    return this
      .orderLines
      .map( (ol) => ol.price )
      .reduce( (a,b) => a+b, 0 );
  }
}
