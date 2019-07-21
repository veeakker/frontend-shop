import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  paymentStatus: attr(),
  orderLines: hasMany('order-line')
});
