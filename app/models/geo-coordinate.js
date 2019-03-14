import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

export default class GeoCoordinateModel extends Model {
  @attr() latitude;
  @attr() longitude;
  @belongsTo('postal-address') postalAddress;

  @computed('latitude', 'longitude')
  get location(){
    if( this.latitude && this.longitude ) {
      return [ this.latitude, this.longitude ];
    } else {
      return null;
    }
  }
}
