import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class WebshopCheckoutFinishRoute extends Route {
  @service store;

  async model({basket_id}) {
    const baskets = await this.store.query('basket', {
      ":id:": basket_id,
      include: "order-lines.offering.type-and-quantity.product,order-lines.offering.unit-price,delivery-address.postal-address,invoice-address.postal-address"
    });
    return baskets.firstObject;
  }
}
