import DS from 'ember-data';
const { Model } = DS;
import { attr, hasMany } from '@ember-decorators/data';

export default class DeliveryKindModel extends Model {
  @attr() label;
  @attr() uri;
  @hasMany('delivery-place') deliveryPlaces;
}
