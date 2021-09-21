import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model, { attr, belongsTo } from '@ember-data/model';

export default class OrderLineModel extends Model {
  @belongsTo('offering') offering
  @attr('number') amount

  @computed( 'amount', 'offering.unitPrice.value' )
  get price() {
    // we don't use defaults here, as an NaN or undefined price is
    // probably preferred over an incorrect one.
    const amount = this.amount;
    const price = get(this.offering, "unitPrice.value");
    return amount * price;
  }

  @alias( 'offering.typeAndQuantity.product' ) product;

  @alias( 'offering.unitPrice.value' ) pricePerUnit;
}
