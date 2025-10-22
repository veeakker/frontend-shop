import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';
import { use, Resource } from 'ember-could-get-used-to-this';
import { action } from '@ember/object';
import ExternalPromise from 'veeakker/utils/external-promise';

// const DEFAULT_DELIVERY_PLACE_ID = "60f710bd-5022-4bd1-be7c-46eebbf3dfb1";
const DEFAULT_DELIVERY_PLACE_ID = "93c60ad0-2b37-4111-90ee-411b483dd3fb";

class BasketFetcher extends Resource {
  @tracked value
  @service store

  async getBasket(isUpdate = false) {
    // console.log(this.args.positional[0]); // ensuring we use the input variable
    const pBasket = this.args.positional[0];
    const result = await (await fetch(this.basketUrl,{
      headers: {
        accept: "application/vnd.api+json"
      }
    })).json();
    if ( isUpdate ) {
      this.value.set("orderLines",[]);
    }
    let deliveryPlaceId = result.data[0]?.relationships["delivery-place"]?.data?.id;

    this.store.pushPayload( result );
    const basket = this.store.peekRecord('basket', result.data[0].id);

    try {
      // fetch delivery-place with extra information
      await this.store.query("delivery-place", {
        "filter[:id:]": deliveryPlaceId || DEFAULT_DELIVERY_PLACE_ID,
        include: "delivery-kind,geo-coordinate,postal-address,business-entity"
      });
      // const deliveryPlace = deliveryPlaces.firstObject;
      // // const deliveryPlace = await this.store.findRecord("delivery-place", deliveryPlaceId);
      // basket.set("deliveryPlace", deliveryPlace);
      await basket.deliveryPlace; // should come from the cache now
    } catch (e) {
      // TODO: provide warning to end user
      // eslint-disable-next-line no-console
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

class DeliveryPlaceFetcher extends Resource {
  @tracked value

  async setup() {
    const [basket, deliveryPlace] = this.args.positional;
    if ( deliveryPlace ) {
      this.value = await deliveryPlace;
    } else if ( basket ) {
      this.value = await basket.deliveryPlace;
    } else {
      this.value = undefined;
    }
  }
}

class BusinessEntityFetcher extends Resource {
  @tracked value

  async setup() {
    const [deliveryPlace] = this.args.positional;
    if ( deliveryPlace ) {
      this.value = await deliveryPlace.businessEntity;
    } else {
      this.value = undefined;
    }
  }
}

class ConstrainingBusinessEntityFetcher extends Resource {
  @tracked value;

  async setup() {
    const [businessEntity] = this.args.positional;
    if ( (await businessEntity?.disallowedProductGroups)?.length )
      this.value = businessEntity;
    else
      this.value = undefined;
  }
}

class AwaitResource extends Resource {
  @tracked value;

  async setup() {
    this.value = await this.args.positional[0];
  }
}

class TotalPriceResource extends Resource {
  @tracked value
  @service store

  async setup() {
    const orderLines = await this.args.positional[0];
    if( orderLines?.length ){
      // eslint-disable-next-line ember/no-get
      const enabledOrderLines = [];
      for ( let orderLine of orderLines ) {
        // eslint-disable-next-line ember/no-get
        let ol = await orderLine;
        let product = await ol.pProduct;
        if ( product.isEnabled ) {
          enabledOrderLines.push(ol);
        }
      }
      // const enabledOrderLines = orderLines.filter( (line) => get(line, "product.isEnabled") );
      // const prices = enabledOrderLines.map( (ol) => get(ol, "price") || 0 );

      // NOTE: this strategy prefers to render no price if we could not correctly calculate it.  That may not be
      // preferred either.
      let totalPrice = 0;
      for( let orderLine of enabledOrderLines ) {
        totalPrice += await orderLine.pPrice;
      }
      this.value = totalPrice;
    } else {
      this.value = undefined;
    }
  }
}

export default class BasketService extends Service {
  @service store
  @service plausible
  @tracked basketPromise = new ExternalPromise(); // use pBasket instead!
  @use basket = new BasketFetcher(() => [this.basketPromise])
  @use deliveryPlace = new DeliveryPlaceFetcher(() => [this.basket,this.basket?.deliveryPlace])
  @use businessEntity = new BusinessEntityFetcher(() => [this.deliveryPlace]);
  @use constrainingBusinessEntity = new ConstrainingBusinessEntityFetcher(() => [this.businessEntity]);

  @action
  setDeliveryPlace( deliveryPlace ) {
    this.basket.deliveryPlace = deliveryPlace;
  }

  async getBusinessEntity() {
    // TODO: turn into something like pBasket instead

    // Used in various places to determine if an offering is available and if there are products to be shown in a
    // productGroup.
    let basket = await this.pBasket;
    let place = basket
      && ((await basket.deliveryPlace)
        || basket.deliveryPlace);

    let businessEntity = place && await place.businessEntity;
    return businessEntity;
  }

  async getConstrainingBusinessEntity() {
    const entity = await this.getBusinessEntity();
    if ( (await entity?.disallowedProductGroups)?.length )
      return entity;
    else
      return;
  }

  get orderLines() {
    return this.basket?.orderLines;
  }

  @use orderLinesR = new AwaitResource(() => [this.basket?.orderLines]);
  get hasUnavailableOrderLines() {
    return (this.orderLinesR || []).some( (orderLine) =>
      ! orderLine.availableForBasketLocation
    );
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
    // eslint-disable-next-line no-console
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
        "Content-Type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json"
      },
      body: JSON.stringify({
        offeringUuid: get(offering, "id"),
        amount: amount
      })
    });
    this.reloadBasket();
    this.plausible.trackEvent('add-product');
  }

  /**
   * Removes <amount> items of type <offering> from the orderLines.
   */
  async removeOffer( offering, amount ){
    const obj = await this.objectForOffering( offering );
    // TODO: update amount through basket service
    set(obj, 'amount', obj.amount - amount);
    if( obj.amount <= 0 ) {
      await fetch(`/current-basket/delete-order-line`, {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json"
        },
        body: JSON.stringify({
          orderLineUuid: obj.id
        })
      });
    }
    this.reloadBasket();
  }

  async objectForOffering( offering ) {
    return (await this.orderLines).findBy( "offering", offering );
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
        'Content-Type': "application/vnd.api+json",
        "Accept": "application/vnd.api+json"
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
    const deliveryPostal = deliveryAddress.postalAddress.content; // TODO: find better way to unpack
    const hasCustomDeliveryPlace = basket.hasCustomDeliveryPlace;
    const deliveryPlaceUuid = basket.deliveryPlace.get("id");
    const deliveryType = basket.deliveryType;

    await fetch('/current-basket/persist-delivery-info', {
      method: "POST",
      headers: {
        'Content-Type': "application/vnd.api+json",
        'Accept': "application/vnd.api+json"
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

  /**
   * Save the comment for an orderLine in the basket.
   */
  async persistComment( orderLine, comment ) {
    await fetch('/current-basket/add-comment-to-order-line', {
      method: "POST",
      headers: {
        'Content-Type': "application/vnd.api+json",
        "Accept": "application/vnd.api+json"
      },
      body: JSON.stringify({
        orderLineUuid: orderLine.id,
        comment: comment
      })
    });
    orderLine.commentPersisted();
  }

  @use totalPrice = new TotalPriceResource(() => [this.orderLines])
}

export { BasketFetcher };
