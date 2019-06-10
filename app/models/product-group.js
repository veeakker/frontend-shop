import { computed } from '@ember/object';
import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default class ProductGroupModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @belongsTo('product-group', { inverse: 'childGroups' }) parentGroup;
  @hasMany('product-group', { inverse: 'parentGroup' }) childGroups;
  @hasMany('product') spotlightProducts;

  @computed('childGroups.@each.sortIndex')
  get sortedChildren() {
    return (this.childGroups || []).sortBy('sortIndex');
  }
}
