import Model, { attr, hasMany } from '@ember-data/model';

export default class BusinessEntityModel extends Model {
  @attr('string') name;
  @attr('string') email;
  @attr('string') description;

  @hasMany('product-group', { async: true, inverse: null } ) disallowedProductGroups;
}
