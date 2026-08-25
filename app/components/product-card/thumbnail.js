import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import config from 'veeakker/config/environment';

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
    const shopPlaceholder = shop && get(shop, 'placeholderImage');
    if (shopPlaceholder && shopPlaceholder.get('id')) {
      const size = { width: 244, height: 200 };
      return shopPlaceholder.content?.sizedImageUrl(size);
    } else if (config.mainSite.enabled === 'false') {
      return '/images/placeholder-goedgekozen.svg';
    } else {
      return '/images/logo-veeakker.png';
    }
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
