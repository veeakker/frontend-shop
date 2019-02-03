import DS from 'ember-data';
const { Model } = DS;
import { attr, hasMany } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

export default class DeliveryKindModel extends Model {
  @attr() label;
  @attr() uri;
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
}
