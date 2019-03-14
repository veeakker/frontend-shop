import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo, hasMany } from '@ember-decorators/data';

export default class SpotlightProductModel extends Model {
  @attr() sortIndex;
  @belongsTo('product') product;
  @hasMany('product-group') productGroups;
}
