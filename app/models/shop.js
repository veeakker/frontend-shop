import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ShopModel extends Model {
  @attr('string') label;
  @attr('string') style;
  @attr('string') slug;
  @belongsTo('file', { async: true, inverse: null }) logo;
  @belongsTo('file', { async: true, inverse: null }) topImage;
  @belongsTo('file', { async: true, inverse: null }) placeholderImage;
  @hasMany('offering', { async: true, inverse: null }) offerings;
  @hasMany('delivery-place', { async: true, inverse: null }) deliveryPlaces;
  @hasMany('product-group', { async: true, inverse: null }) disallowedProductGroups;
  @hasMany('business-entity', { async: true, inverse: null }) suppliers;

  get hasCustomTopRegion() {
    const logo = this.logo;
    const topImage = this.topImage;
    return Boolean(
      (logo && logo.get('id')) ||
      (topImage && topImage.get('id')) ||
      this.style
    );
  }
}
