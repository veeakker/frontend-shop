import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Model, { attr, belongsTo } from '@ember-data/model';
import { use, Resource } from 'ember-could-get-used-to-this';

class PricePerUnit extends Resource {
  @tracked value;

  async setup() {
    const offering = await this.args.positional[0];
    await get(offering, "unitPrice");
    setTimeout(() => this.value = get(offering,"unitPrice.value"), 50);
  }
}

class OfferingForProduct extends Resource {
  @tracked value;

  async setup() {
    const offering = await this.args.positional[0];
    await get(offering, "typeAndQuantity");
    setTimeout( () => this.value = get(offering, "typeAndQuantity.product"), 50);
  }
}

export default class OrderLineModel extends Model {
  @belongsTo('offering') offering
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

  @use product = new OfferingForProduct(() => [this.offering]);
  @use pricePerUnit = new PricePerUnit(() => [this.offering]);

  // @alias('offering.typeAndQuantity.product') product;
  // @alias('offering.unitPrice.value') pricePerUnit;
}
