import Model, { hasMany, attr, belongsTo } from '@ember-data/model';

export default class BasketModel extends Model {
  @attr() paymentStatus;
  @hasMany('order-line') orderLines;
  @belongsTo('delivery-place') deliveryPlace;
}
