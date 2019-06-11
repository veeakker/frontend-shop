import DS from 'ember-data';
import { computed } from '@ember/object';

const { Model, attr, belongsTo } = DS;

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
