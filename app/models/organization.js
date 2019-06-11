import DS from 'ember-data';
const { Model, hasMany } = DS;

export default class OrganizationModel extends Model {
  @hasMany('delivery-place') deliveryPlaces;
}
