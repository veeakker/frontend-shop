import Model, { attr, hasMany } from '@ember-data/model';

export default class DeliveryRouteModel extends Model {
  @attr('string') label;
  @attr('date') nextDeliveryDate;
  @attr('string') lfwLink;
  @hasMany('delivery-place', { async: true, inverse: "deliveryRoute" }) deliveryPlaces;
}
