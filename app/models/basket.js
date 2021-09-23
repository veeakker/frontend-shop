import Model, { hasMany, attr } from '@ember-data/model';

export default class BasketModel extends Model {
  @attr() paymentStatus;
  @hasMany('order-line') orderLines;
}
