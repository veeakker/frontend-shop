import Model, { attr } from '@ember-data/model';

export default class FileModel extends Model {
  @attr() filename;

  get downloadUrl(){
    if( this.id )
      return `/files/${this.id}/download`;
    return undefined;
  }

  sizedImageUrl( { width = null, height = null } ){
    const params = { width, height };

    // build query params string
    var esc = encodeURIComponent;
    var query = Object.keys(params)
        .filter( k => params[k] !== null )
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

    // build the resulting uri
    if( this.id )
      return `/imgs/${this.id}?${query}`;

    return undefined;
  }
}
