import Model, { belongsTo } from '@ember-data/model';

export default class OfferingModel extends Model {
  @belongsTo('unit-price-specification') unitPrice;
  @belongsTo('type-and-quantity') typeAndQuantity;
}
