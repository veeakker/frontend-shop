import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo, hasMany } from '@ember-decorators/data';

export default class ProductGroupModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @belongsTo('product-group', { inverse: 'childGroups' }) parentGroup;
  @hasMany('product-group', { inverse: 'parentGroup' }) childGroups;
  @hasMany('product') spotlightProducts;
}
