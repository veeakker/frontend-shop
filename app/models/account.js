import Model, { attr, belongsTo } from '@ember-data/model';
export default class AccountModel extends Model {
  @attr('string') email;
  @attr('string') password;
  @attr('string') firstName;
  @attr('string') lastName;
  @belongsTo('postal-address') postalAddres;
}
