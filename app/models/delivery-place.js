import Model, { belongsTo } from '@ember-data/model';

export default class DeliveryPlaceModel extends Model {
  @belongsTo('delivery-kind') deliveryKind;
  @belongsTo('geo-coordinate') geoCoordinate;
  @belongsTo('postal-address') postalAddress;
}
