import Model, { attr } from '@ember-data/model';

export default class BusinessEntityModel extends Model {
  @attr('string') name;
  @attr('string') email;
  @attr('string') description;
}
