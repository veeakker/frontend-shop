import Model, { belongsTo, attr } from '@ember-data/model';

export default class DeliveryPlaceModel extends Model {
  @attr() label;
  @attr('boolean') isEnabled;
  @belongsTo('delivery-kind') deliveryKind;
  @belongsTo('geo-coordinate') geoCoordinate;
  @belongsTo('postal-address') postalAddress;
  @belongsTo('delivery-route') deliveryRoute;
}
