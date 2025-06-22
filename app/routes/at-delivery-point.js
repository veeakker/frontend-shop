import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class AtDeliveryPointRoute extends Route {
  @service store;
  @service basket;
  @service router;

  async model({slug}) {
    const basket = await this.basket.pBasket;
    const deliveryPlaces = await this.store.query('delivery-place', {
      "filter[:exact:slug]": slug
    });
    if ( deliveryPlaces.length ) {
      basket.deliveryPlace = deliveryPlaces[0];
    }
    // TODO get the deliveryType dynamically.
    basket.deliveryType = "http://veeakker.be/delivery-methods/shop";
    basket.save();
    this.router.transitionTo("webshop");
  }
}
