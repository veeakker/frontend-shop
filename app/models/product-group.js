import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProductGroupModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @belongsTo('product-group', { inverse: "childGroups" }) parentGroup;
  @hasMany('product-group', { inverse: "parentGroup" }) childGroups;
  @hasMany('spotlight-product') spotlightProducts;
  @hasMany('product', { inverse: "productGroups" }) products;
}
