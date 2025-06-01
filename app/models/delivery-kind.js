import Model, { attr, hasMany } from '@ember-data/model';

const knownLabels = [{
  uri: "http://veeakker.be/delivery-kinds/winkel",
  simpleName: "winkel",
  normalizedLabel: "butchery"
},{
  uri: "http://veeakker.be/delivery-kinds/toeren",
  simpleName: "toer",
  normalizedLabel: "routes",
},{
  uri: "http://veeakker.be/delivery-kinds/natuurwinkels",
  simpleName: "natuurwinkel",
  normalizedLabel: "health-shops"
},{
  uri: "http://veeakker.be/delivery-kinds/buurderijen",
  simpleName: "buurderij",
  normalizedLabel: "local-farms"
},{
  uri: "http://veeakker.be/delivery-kinds/webshop",
  simpleName: "webshop",
  normalizedLabel: "home-delivery"
}];

/**
 * Allows to retrieve the kind obect, notFound is returned when no match
 * was found.
 */
function kindBy( key, value, notFound ) {
  for( const label of knownLabels )
    if( label[key] == value )
      return label;

  return notFound;
}

export default class DeliveryKindModel extends Model {
  @attr() label;
  @attr() uri;
  @attr() description;
  @hasMany('delivery-place', { async: true, inverse: "deliveryKind" }) deliveryPlaces;

  get simpleName(){
    return kindBy( "uri", this.uri, { simpleName: "onbekend" } ).simpleName;
  }

  get normalizedLabel(){
    return kindBy( "uri", this.uri, { normalizedLabel: "unknown" } ).normalizedLabel;
  }
}

function uriForNormalizedLabel( label ) {
  return kindBy( "normalizedLabel", label, { uri: "unknown" } ).uri;
}

export { uriForNormalizedLabel }
