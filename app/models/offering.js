import DS from 'ember-data';
const { Model, belongsTo } = DS;

export default class OfferingModel extends Model {
  @belongsTo('unit-price-specification') unitPrice;
  @belongsTo('type-and-quantity') typeAndQuantity;
}
