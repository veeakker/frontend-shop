import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class extends Component {
  @service session;

  get product() {
    return this.args.product;
  }

  get thumbnail() {
    return this.product?.get("thumbnail");
  }

  get placeholderImageUrl() {
    const shop = this.session.webshop;
    if (shop) {
      const placeholder = get(shop, 'placeholderImage');
      if (placeholder && placeholder.get('id')) {
        const size = { width: 244, height: 200 };
        return placeholder.content?.sizedImageUrl(size);
      }
    }
    return '/images/logo-veeakker.png';
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
