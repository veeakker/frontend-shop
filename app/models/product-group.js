import { computed } from '@ember/object';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ProductGroupModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @belongsTo('product-group', { inverse: 'childGroups' }) parentGroup;
  @hasMany('product-group', { inverse: 'parentGroup' }) childGroups;
  @hasMany('product') spotlightProducts;
  @hasMany('product', { inverse: "productGroups" }) products;

  @computed('childGroups.@each.sortIndex')
  get sortedChildren() {
    return (this.childGroups || []).sortBy('sortIndex');
  }

  @computed('products.@each.sortIndex')
  get sortedProducts() {
    return (this.products || []).sortBy('sortIndex');
  }

  @computed('products.@each.sortIndex', 'products.@each.isEnabled')
  get sortedEnabledProducts() {
    return (this.products || [])
      .filter( (product) => product.isEnabled )
      .sortBy('sortIndex');
  }
}
