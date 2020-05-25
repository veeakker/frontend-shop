import Model, { attr, belongsTo } from '@ember-data/model';

export default class TypeAndQuantityModel extends Model {
  @attr('number') value;
  @attr() unit; // GRM = g; KGM = kg; C62 = 1
  @belongsTo('product') product;
}
