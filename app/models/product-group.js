import Model, { attr, hasMany } from '@ember-data/model';

export default class ProductGroupModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @hasMany('product-group', { async: true, inverse: "childGroups" }) parentGroups;
  @hasMany('product-group', { async: true, inverse: "parentGroups" }) childGroups;
  @hasMany('spotlight-product', { async: true, inverse: "productGroups" }) spotlightProducts;
  @hasMany('product', { async: true, inverse: "productGroups" }) products;
}
