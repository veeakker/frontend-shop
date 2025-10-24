import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class OfferingModel extends Model {
  @belongsTo('unit-price-specification', { async: true, inverse: null }) unitPrice;
  @belongsTo('type-and-quantity', { async: true, inverse: null }) typeAndQuantity;
  @belongsTo('business-entity', { async: true, inverse: null }) supplier;
  @hasMany('business-entity', { async: true, inverse: null }) availableAtOrFrom;
  @attr('boolean') isEnabled;
}
