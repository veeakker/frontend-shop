import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default class SpotlightProductModel extends Model {
  @attr() sortIndex;
  @belongsTo('product') product;
  @hasMany('product-group') productGroups;
}
