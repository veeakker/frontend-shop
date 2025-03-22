import Model, { hasMany, attr, belongsTo } from '@ember-data/model';

export default class BasketModel extends Model {
  @attr() paymentStatus;
  @attr('boolean') hasCustomDeliveryPlace;
  @attr() deliveryType;
  @attr() statusChangedAt;
  @attr() orderStatus;
  @hasMany('order-line') orderLines;
  @belongsTo('delivery-place') deliveryPlace;
  @belongsTo('fullAddress') deliveryAddress;
  @belongsTo('fullAddress') invoiceAddress;
  @belongsTo('person') customer;

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
