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

  async getBasket(isUpdate = false) {
    console.log(this.args.positional[0]); // ensuring we use the input variable
    const result = await (await fetch(`/current-basket/ensure`)).json();
    if ( isUpdate ) {
      this.value.set("orderLines",[]);
    }
    this.store.pushPayload( result );
    this.value = this.store.peekRecord('basket', result.data[0].id);
  }

  async setup() {
    await this.getBasket(false);
  }

  async update() {
    await this.getBasket(true);
  }

}

export default class BasketService extends Service {
  @service store
  @tracked
  fetchDate = new Date();
  @use basket = new BasketFetcher(() => [this.fetchDate])

  @action
  setDeliveryPlace( deliveryPlace ) {
    this.basket.deliveryPlace = deliveryPlace;
    this.basket.save();
  }

  get orderLines() {
    return this.basket?.orderLines;
  }

  async saveBasket(){
    await this.basket?.save();
  }

  reloadBasket() {
    // reset fetchDate, which is used in the basket Resource, should
    // ensure the basket resource is recomputed
    this.fetchDate = new Date();
  }

  /**
   * Adds <amount> items of type <offering> to the orderLines
   */
  async addOffer( offering, amount ){
    // TODO: support combining order lines in API by summing data.
    await fetch(`/current-basket/add-order-line`, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      body: JSON.stringify({
        offeringUuid: offering.id,
        amount: amount
      })
    });
    this.reloadBasket();
  }

  /**
   * Removes <amount> items of type <offering> from the orderLines.
   */
  async removeOffer( offering, amount ){
    const obj = this.objectForOffering( offering );
    // TODO: update amount through basket service
    set(obj, 'amount', obj.amount - amount);
    if( obj.amount <= 0 ) {
      await fetch(`/current-basket/delete-order-line`, {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json"
        },
        body: JSON.stringify({
          orderLineUuid: obj.id
        })
      });
    }
    this.reloadBasket();
  }

  objectForOffering( offering ) {
    return this.orderLines.findBy( "offering", offering );
  }

  hasOffering( offering ) {
    this.objectForOffering( offering ) && true;
  }

  /**
   * The basket itself connects to invoice information which is
   * persisted through the basket service with this method.
   */
  async persistInvoiceInfo() {
    const basket = this.basket;
    const invoiceAddress = basket.invoiceAddress.content; // TODO: find better way to unpack
    const invoicePostal = invoiceAddress.postalAddress.content; // TODOi find better way to unpack

    await fetch('/current-basket/persist-invoice-info', {
      method: "POST",
      headers: {
        'Content-Type': "application/vnd.api+json"
      },
      body: JSON.stringify({
        basketUuid: basket.id,
        invoiceAddress: invoiceAddress.serialize().data,
        invoicePostal: invoicePostal.serialize().data
      })});
  }

 /**
   * The basket itself connects to delivery information which is
   * persisted through the basket service with this method.
   */
  async persistDeliveryInfo() {
    const basket = this.basket;
    const deliveryAddress = basket.deliveryAddress.content; // TODO: find better way to unpack
    const deliveryPostal = deliveryAddress.postalAddress.content; // TODOi find better way to unpack

    await fetch('/current-basket/persist-delivery-info', {
      method: "POST",
      headers: {
        'Content-Type': "application/vnd.api+json"
      },
      body: JSON.stringify({
        basketUuid: basket.id,
        deliveryAddress: deliveryAddress.serialize().data,
        deliveryPostal: deliveryPostal.serialize().data
      })});
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
