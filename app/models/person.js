import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') email;
  @attr('string') phone;
  @belongsTo('postal-address') postalAddress;
  @hasMany('account') accounts;
  @hasMany('favourite') favourites;
}
