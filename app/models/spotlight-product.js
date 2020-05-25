import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SpotlightProductModel extends Model {
  @attr() sortIndex;
  @belongsTo('product') product;
  @hasMany('product-group') productGroups;
}
