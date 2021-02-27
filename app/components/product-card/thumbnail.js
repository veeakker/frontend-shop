import { computed } from '@ember/object';
import Component from '@ember/component';

export default class extends Component {
  tagName = ""

  @computed('product.thumbnail.id')
  get imageUrl() {
    const size = { width: 244, height: 200 };
    const thumbnail = this.product && this.product.get("thumbnail");
    if( thumbnail && thumbnail.get('id') ) {
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }
    return null;
  }

  @computed('product.thumbnail.id')
  get largeImageUrl() {
    const size = { width: 500, height: 410 };
    const thumbnail = this.product && this.product.get("thumbnail");
    if( thumbnail && thumbnail.get('id') ) {
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }
    return null;
  }

  @computed('product.thumbnail.id')
  get doubleLargeImageUrl() {
    const size = { width: 1000, height: 820 };
    const thumbnail = this.product && this.product.get("thumbnail");
    if( thumbnail && thumbnail.get('id') ) {
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }
    return null;
  }
}
