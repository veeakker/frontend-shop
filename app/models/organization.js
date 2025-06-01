import Model, { hasMany } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @hasMany('delivery-place', { async: true, inverse: null }) deliveryPlaces;
}
