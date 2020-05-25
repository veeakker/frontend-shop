import Model, { attr } from '@ember-data/model';

export default class UnitPriceSpecificationModel extends Model {
  @attr() unit;
  @attr('number') value;
}
