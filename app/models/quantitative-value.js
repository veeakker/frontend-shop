import DS from 'ember-data';
const { Model, attr } = DS;

export default class QuantitativeValueModel extends Model {
  @attr() unit;
  @attr('number') value;
}
