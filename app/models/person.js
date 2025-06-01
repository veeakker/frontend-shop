import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') email;
  @attr('string') phone;
  @belongsTo('postal-address', { async: true, inverse: null}) postalAddress;
  @hasMany('account', { async: true, inverse: "person" }) accounts;
  @hasMany('favourite', { async: true, inverse: "person" }) favourites;
}
