import { service } from '@ember/service';
import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Model, { attr, belongsTo } from '@ember-data/model';
import { use, Resource } from 'ember-could-get-used-to-this';

class ProductForOfferingResource extends Resource {
  @tracked value;

  async setup() {
    const [pendingOffer] = await this.args.positional;
    const offering = await pendingOffer;
    if ( offering ) {
      const typeAndQuantity = await get(offering, "typeAndQuantity");
      this.value = typeAndQuantity ? await get(typeAndQuantity, "product") : undefined;
    }
  }
}

class PricePerUnitResource extends Resource {
  @tracked value;

  async setup() {
    const [pendingOffer] = await this.args.positional;
    const offering = await pendingOffer;
    if ( offering ) {
      const unitPrice = await offering.unitPrice;
      this.value = unitPrice ? unitPrice.value : undefined;
    } else {
      this.value = undefined;
    }
  }
}

class AvailableForBasketLocationResource extends Resource {
  @tracked value;

  async setup() {
    const [offering, constrainingBusinessEntity] = await this.args.positional;
    const availableAtOrFrom = await get(await offering, "availableAtOrFrom");

    if ( !constrainingBusinessEntity ) {
      this.value = true;
    } else if ( [...availableAtOrFrom].find((be) => be.id == constrainingBusinessEntity.id) ) {
      this.value = true;
    } else {
      this.value = false;
    }
  }
}

export default class OrderLineModel extends Model {
  @service basket;

  @belongsTo('offering', { async: true, inverse: null }) offering
  @attr('number') amount
  @attr() comment

  @tracked commentChanged;

  get monitoredComment() {
    return this.comment;
  }

  set monitoredComment(value) {
    this.comment = value;
    this.commentChanged = true;
  }

  commentPersisted() {
    // called by basket service
    this.commentChanged = false;
  }

  /**
    Derived from tracked record state: reactive on in-place updates of
    amount and offering, no snapshot involved.
   */
  get price() {
    // we don't use defaults here, as an NaN or undefined price is
    // probably preferred over an incorrect one.
    const amount = this.amount;
    const price = this.pricePerUnit;
    if ( !amount || price === undefined ) {
      return undefined;
    }
    return amount * price;
  }

  @use
  pricePerUnit = new PricePerUnitResource( () => [this.offering] );

  @use
  product = new ProductForOfferingResource( () => [this.offering] );

  @use
  availableForBasketLocation = new AvailableForBasketLocationResource( () => [this.offering, this.basket?.constrainingBusinessEntity] );
}
