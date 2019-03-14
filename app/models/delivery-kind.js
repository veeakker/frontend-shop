import DS from 'ember-data';
const { Model } = DS;
import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

export default class DeliveryKindModel extends Model {
  @attr() label;
  @attr() uri;
  @attr() description;
  @hasMany('delivery-place') deliveryPlaces;

  @computed('uri')
  get simpleName(){
    const uri = this.uri;
    if( uri == "http://veeakker.be/delivery-kinds/winkel" )
      return "winkel";
    if( uri == "http://veeakker.be/delivery-kinds/toeren")
      return "toer";
    if( uri == "http://veeakker.be/delivery-kinds/natuurwinkels")
      return "natuurwinkel";
    if( uri == "http://veeakker.be/delivery-kinds/buurderijen")
      return "buurderij";
    if( uri == "http://veeakker.be/delivery-kinds/webshop")
      return "webshop";
    else
      return "onbekend";
  }

  @computed('uri')
  get normalizedLabel(){
    const uri = this.uri;
    if( uri == "http://veeakker.be/delivery-kinds/winkel" )
      return "butchery";
    if( uri == "http://veeakker.be/delivery-kinds/toeren")
      return "routes";
    if( uri == "http://veeakker.be/delivery-kinds/natuurwinkels")
      return "health-shops";
    if( uri == "http://veeakker.be/delivery-kinds/buurderijen")
      return "local-farms";
    if( uri == "http://veeakker.be/delivery-kinds/webshop")
      return "home-delivery";
    else
      return "unknown";
  }
}

function uriForNormalizedLabel( label ) {
  if( label == "butchery" )
    return "http://veeakker.be/delivery-kinds/winkel";
  if( label =="routes" )
    return "http://veeakker.be/delivery-kinds/toeren";
  if( label =="health-shops" )
    return "http://veeakker.be/delivery-kinds/natuurwinkels";
  if( label =="local-farms" )
    return "http://veeakker.be/delivery-kinds/buurderijen";
  if( label =="home-delivery" )
    return "http://veeakker.be/delivery-kinds/webshop";
  else
    return "unknown";
}

export { uriForNormalizedLabel }
