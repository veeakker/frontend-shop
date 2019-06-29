import { computed } from '@ember/object';
import DS from 'ember-data';
const { Model, attr } = DS;

export default class FileModel extends Model {
  @attr() filename;

  @computed('id')
  get downloadUrl(){
    if( this.get('id') )
      return `/files/${this.get('id')}/download`;
    return undefined;
  }
}
