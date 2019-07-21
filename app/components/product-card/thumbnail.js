import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default class extends Component {
  tagName = ""

  @computed('product.thumbnail.id')
  get imageUrl() {
    // this.get('product.thumbnail.downloadUrl'); // invalidate keys
    const size = { width: 244, height: 200 };
    const thumbnail = this.get('product.thumbnail');
    if( thumbnail && thumbnail.get('id') ) {
      const thumbnailObj = thumbnail.sizedImageUrl ? thumbnail : thumbnail.content;
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }

    return null;
  }
  // @alias( "product.thumbnail.downloadUrl" ) downloadUrl
}
