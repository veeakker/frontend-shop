import Model, { attr } from '@ember-data/model';

export default class PostalAddressModel extends Model {
  @attr('string') country;
  @attr('string') locality;
  @attr('string') postalCode;
  @attr('string') streetAddress;
}
