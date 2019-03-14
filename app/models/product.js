import DS from 'ember-data';
const { Model } = DS;
import { attr, hasMany } from '@ember-decorators/data';

export default class ProductModel extends Model {
  @attr() label;
  @attr('number') sortIndex;
  @hasMany('product-group') productGroups;
}
