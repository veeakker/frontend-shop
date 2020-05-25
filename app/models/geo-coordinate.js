import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

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
