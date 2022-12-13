import Component from '@glimmer/component';

export default class extends Component {
  get product() {
    return this.args.product;
  }

  get thumbnail() {
    return this.product?.get("thumbnail");
  }

  get imageUrl() {
    const size = { width: 244, height: 200 };
    const thumbnail = this.thumbnail;
    if( thumbnail && thumbnail.get('id') ) {
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }
    return null;
  }

  get largeImageUrl() {
    const size = { width: 500, height: 410 };
    const thumbnail = this.thumbnail;
    if( thumbnail && thumbnail.get('id') ) {
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }
    return null;
  }

  get doubleLargeImageUrl() {
    const size = { width: 1000, height: 820 };
    const thumbnail = this.thumbnail;
    if( thumbnail && thumbnail.get('id') ) {
      if( thumbnail.content )
        return thumbnail.content.sizedImageUrl( size );
    }
    return null;
  }
}
