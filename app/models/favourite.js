import Model, { belongsTo } from '@ember-data/model';

export default class FavouriteModel extends Model {
  @belongsTo('product', { async: true, inverse: null }) product;
  @belongsTo('person', { async: true, inverse: 'favourites'}) person;
}
