import Model, { hasMany, attr } from '@ember-data/model';

export default Model.extend({
  paymentStatus: attr(),
  orderLines: hasMany('order-line')
});
