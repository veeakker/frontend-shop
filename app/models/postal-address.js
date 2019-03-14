import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data';

export default class PostalAddressModel extends Model {
  @attr() country;
  @attr() locality;
  @attr() postalCode;
  @attr() streetAddress;
}
