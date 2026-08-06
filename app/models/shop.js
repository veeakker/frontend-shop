import Model, { attr, hasMany } from '@ember-data/model';

export default class ShopModel extends Model {
  @attr('string') label;
  @attr('string') style;
  @attr('string') slug;
  @hasMany('offering', { async: true, inverse: null }) offerings;
}
