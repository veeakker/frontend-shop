import Model, { attr } from '@ember-data/model';

export default class PostalAddressModel extends Model {
  @attr() country;
  @attr() locality;
  @attr() postalCode;
  @attr() streetAddress;
}
