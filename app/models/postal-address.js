import DS from 'ember-data';
const { Model, attr } = DS;

export default class PostalAddressModel extends Model {
  @attr() country;
  @attr() locality;
  @attr() postalCode;
  @attr() streetAddress;
}
