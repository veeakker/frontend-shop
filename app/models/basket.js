import Model, { hasMany, attr, belongsTo } from '@ember-data/model';

export default class BasketModel extends Model {
  @attr() paymentStatus;
  @attr('boolean') hasCustomDeliveryPlace;
  @attr() deliveryType;
  @attr() statusChangedAt;
  @attr() orderStatus;
  @hasMany('order-line', { async: true, inverse: null }) orderLines;
  @belongsTo('delivery-place', { async: true, inverse: null }) deliveryPlace;
  @belongsTo('fullAddress', { async: true, inverse: null }) deliveryAddress;
  @belongsTo('fullAddress', { async: true, inverse: null }) invoiceAddress;
  @belongsTo('person', { async: true, inverse: null }) customer;

  get delivery() {
    return this.deliveryAddress;
  }

  get invoice() {
    return this.invoiceAddress;
  }
}

const CONFIRMED = "http://veeakker.be/order-statuses/confirmed";
const DRAFT = "http://veeakker.be/order-statuses/draft";

export { CONFIRMED, DRAFT };
