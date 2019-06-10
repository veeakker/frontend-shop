import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default class ProductModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @hasMany('product-group') productGroups;
}
