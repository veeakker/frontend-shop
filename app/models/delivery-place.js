import DS from 'ember-data';
const { Model, belongsTo } = DS;

export default class DeliveryPlaceModel extends Model {
  @belongsTo('delivery-kind') deliveryKind;
  @belongsTo('geo-coordinate') geoCoordinate;
  @belongsTo('postal-address') postalAddress;
}
