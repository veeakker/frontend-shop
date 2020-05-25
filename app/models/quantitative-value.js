import Model, { attr } from '@ember-data/model';

export default class QuantitativeValueModel extends Model {
  @attr() unit;
  @attr('number') value;
}
