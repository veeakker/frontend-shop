import DS from 'ember-data';
const { Model, attr } = DS;

export default class UnitPriceSpecificationModel extends Model {
  @attr() unit;
  @attr('number') value;
}
