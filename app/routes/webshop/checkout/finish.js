import { get } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopCheckoutFinishRoute extends Route {
  async model({basket_id}) {
    // Let's ensure we have a basket loaded in the route with everything
    // preloaded so we can easily traverse for calculations.

    // 1. Fetch the basket itself
    const basketJsonInfo = await (await fetch(`/current-basket/previous/${basket_id}`)).json();
    this.store.pushPayload( basketJsonInfo );
    const basket = this.store.peekRecord('basket', basketJsonInfo.data[0].id);

    // 2. Fetch related information with respect to pricing
    let totalCost = 0;

    for (const orderLine of (await basket.orderLines).toArray()) {
      const offering = await orderLine.get("offering");
      const unitPrice = await get(offering, "unitPrice");
      const amount = await get(orderLine, "amount");
      totalCost += unitPrice.value * amount;
    }

    // Ship the basket as the model
    return { basket, totalCost };
  }
}
