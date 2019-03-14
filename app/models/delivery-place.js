import DS from 'ember-data';
const { Model } = DS;
import { belongsTo } from '@ember-decorators/data';

export default class DeliveryPlaceModel extends Model {
  @belongsTo('delivery-kind') deliveryKind;
  @belongsTo('geo-coordinate') geoCoordinate;
  @belongsTo('postal-address') postalAddress;
}
