import Model, { attr, belongsTo } from '@ember-data/model';
import { use } from 'ember-could-get-used-to-this';
import asyncResource from '../utils/async-resource';

export default class OrderLineModel extends Model {
  @belongsTo('offering') offering
  @attr('number') amount

  get price() {
    // we don't use defaults here, as an NaN or undefined price is
    // probably preferred over an incorrect one.
    const amount = this.amount;
    const price = this.pricePerUnit;
    return amount * price;
  }

  @use product = asyncResource(
    (() => [this.offering]),
    async function() {
      const offering = this.args.positional[0];
      await offering.typeAndQuantity;
      return offering.typeAndQuantity.value;
    })

  @use pricePerUnit = asyncResource(
    (() => [this.offering]),
    async function() {
      const offering = this.args.positional[0];
      await offering.unitPrice;
      return offering.unitPrice.value;
    })

  // @alias('offering.typeAndQuantity.product') product;
  // @alias('offering.unitPrice.value') pricePerUnit;
}
