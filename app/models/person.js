import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @belongsTo('postal-address') postalAddress;
  @hasMany('account') accounts;
  @hasMany('favourite') favourites;
}
