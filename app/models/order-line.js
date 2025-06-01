import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Model, { attr, belongsTo } from '@ember-data/model';
import { use, Resource } from 'ember-could-get-used-to-this';
import ExternalPromise from 'veeakker/utils/external-promise';

class PricePerUnit extends Resource {
  @tracked value;

  async setup() {
    const offering = await this.args.positional[0];
    const externalPromise = this.args.positional[1];
    // eslint-disable-next-line ember/no-get
    const unitPrice = await offering.unitPrice;
    // eslint-disable-next-line ember/no-get
    setTimeout(() => {
      const price = unitPrice.value;
      this.value = price;
      externalPromise.resolve(price);
    }, 50);
  }
}

class OfferingForProduct extends Resource {
  @tracked value;

  async setup() {
    const offering = await this.args.positional[0];
    const externalPromise = this.args.positional[1];
    // eslint-disable-next-line ember/no-get
    await get(offering, "typeAndQuantity");
    // eslint-disable-next-line ember/no-get
    setTimeout(
      async () => {
        this.value = await get(offering, "typeAndQuantity.product")
        externalPromise.resolve(this.value);
      }, 50);
  }
}

class PriceResource extends Resource {
  @tracked value;

  async setup() {
    const [orderLine, pPricePerUnit, pricePromise] = this.args.positional;
    const pricePerUnit = await pPricePerUnit;

    if (orderLine.amount && pricePerUnit) {
      this.value = orderLine.amount * pricePerUnit;
      pricePromise.resolve(this.value);
    } else {
      // we don't use defaults here, as an NaN or undefined price is
      // probably preferred over an incorrect one.
      this.value = undefined;
    }
  }
}

export default class OrderLineModel extends Model {
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

  get price() {
    // we don't use defaults here, as an NaN or undefined price is
    // probably preferred over an incorrect one.
    const amount = this.amount;
    const price = this.pricePerUnit;
    return amount * price;
  }

  @tracked productPromise = new ExternalPromise();
  @use product = new OfferingForProduct(() => [this.offering, this.productPromise]);
  get pProduct() {
    // eslint-disable-next-line no-console
    console.log({product: this.product}); // do something with the product
    return this.productPromise.promise;
  }

  @tracked pricePerUnitPromise = new ExternalPromise();
  @use pricePerUnit = new PricePerUnit(() => [this.offering, this.pricePerUnitPromise]);
  get pPricePerUnit() {
    // eslint-disable-next-line no-console
    console.log({pricePerUnit: this.pricePerUnit}); // do something with the pricePerUnit
    return this.pricePerUnitPromise.promise;
  }

  @tracked pricePromise = new ExternalPromise();
  @use price = new PriceResource( () => [this, this.pPricePerUnit, this.pricePromise] )
  get pPrice() {
    // eslint-disable-next-line no-console
    console.log({price: this.price}); // do something with the price
    return this.pricePromise.promise;
  }
}
