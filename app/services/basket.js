import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';
import { use, Resource } from 'ember-could-get-used-to-this';
import { action } from '@ember/object';

// const DEFAULT_DELIVERY_PLACE_ID = "60f710bd-5022-4bd1-be7c-46eebbf3dfb1";
const DEFAULT_DELIVERY_PLACE_ID = "93c60ad0-2b37-4111-90ee-411b483dd3fb";


class ExternalPromise {
  constructor() {
    this.reset();
  }

  reset() {
    this.promise = new Promise((res,rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}

class BasketFetcher extends Resource {
  @tracked value
  @service store

  async getBasket(isUpdate = false) {
    // console.log(this.args.positional[0]); // ensuring we use the input variable
    const pBasket = this.args.positional[0];
    const result = await (await fetch(this.basketUrl)).json();
    if ( isUpdate ) {
      this.value.set("orderLines",[]);
    }
    let deliveryPlaceId = result.data[0]?.relationships["delivery-place"]?.data?.id;
    if( deliveryPlaceId ) {
      delete result.data[0].relationships["delivery-place"];
      // TODO: set delivery place when it is retrieved.
    }

    this.store.pushPayload( result );
    const basket = this.store.peekRecord('basket', result.data[0].id);

    try {
      const deliveryPlace = (await this.store.query("delivery-place", {
        "filter[:id:]": deliveryPlaceId || DEFAULT_DELIVERY_PLACE_ID,
        include: "delivery-kind,geo-coordinate,postal-address"
      })).firstObject;
      // const deliveryPlace = await this.store.find("delivery-place", deliveryPlaceId);
      basket.set("deliveryPlace", deliveryPlace);
    } catch (e) {
      console.warn("Something went wrong loading the default delivery place");
    }

    this.value = basket;
    pBasket.resolve(basket);
  }

  async setup() {
    await this.getBasket(false);
  }

  async update() {
    await this.getBasket(true);
  }

  get basketUrl() {
    if( this.args.positional[1] ) {
      return `/current-basket/previous/${this.args.positional[1]}`;
    } else {
      return "/current-basket/ensure";
    }
  }
}

export default class BasketService extends Service {
  @service store
  @tracked basketPromise = new ExternalPromise(); // use pBasket instead!
  @use basket = new BasketFetcher(() => [this.basketPromise])


  @action
  setDeliveryPlace( deliveryPlace ) {
    this.basket.deliveryPlace = deliveryPlace;
  }

  get orderLines() {
    return this.basket?.orderLines;
  }

  reloadBasket() {
    // reset fetchDate, which is used in the basket Resource, should
    // ensure the basket resource is recomputed
    // this.fetchDate = new Date();
    this.basketPromise.reject();
    this.basketPromise = new ExternalPromise();
  }

  /**
   * Promise variant of the basket.
   */
  get pBasket() {
    console.log({basket: this.basket}); // use the basket
    return this.basketPromise.promise;
  }

  async requestMerge() {
    await fetch('/current-basket/merge-graphs', {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json"
      }});
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
    const hasCustomDeliveryPlace = basket.hasCustomDeliveryPlace;
    const deliveryPlaceUuid = basket.deliveryPlace.get("id");
    const deliveryType = basket.deliveryType;

    await fetch('/current-basket/persist-delivery-info', {
      method: "POST",
      headers: {
        'Content-Type': "application/vnd.api+json"
      },
      body: JSON.stringify({
        basketUuid: basket.id,
        deliveryAddress: deliveryAddress.serialize().data,
        deliveryPostal: deliveryPostal.serialize().data,
        hasCustomDeliveryPlace,
        deliveryPlaceUuid,
        deliveryType
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

export { BasketFetcher };
