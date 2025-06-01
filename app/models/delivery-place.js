import Model, { belongsTo, attr } from '@ember-data/model';

export default class DeliveryPlaceModel extends Model {
  @attr() label;
  @attr('boolean') isEnabled;
  @attr() lfwLink;
  @belongsTo('delivery-kind', { async: true, inverse: "deliveryPlaces" }) deliveryKind;
  @belongsTo('geo-coordinate', { async: true, inverse: null }) geoCoordinate;
  @belongsTo('postal-address', { async: true, inverse: null }) postalAddress;
  @belongsTo('delivery-route', { async: true, inverse: "deliveryPlaces" }) deliveryRoute;
}
