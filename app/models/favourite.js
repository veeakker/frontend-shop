import Model, { attr, belongsTo } from '@ember-data/model';

export default class FavouriteModel extends Model {
  @belongsTo('product') product;
  @belongsTo('person', {inverse: 'favourites'}) person;
}
