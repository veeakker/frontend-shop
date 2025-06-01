import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SpotlightProductModel extends Model {
  @attr() sortIndex;
  @belongsTo('product', { async: true, inverse: null }) product;
  // NOTE: set inverse: null so this doesn't cache
  @hasMany('product-group', { async: true, inverse: null }) productGroups;
}
