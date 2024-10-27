import { get } from '@ember/object';
import Route from '@ember/routing/route';

export default class WebshopCheckoutFinishRoute extends Route {
  async model({basket_id}) {
    // Let's ensure we have a basket loaded in the route with everything
    // preloaded so we can easily traverse for calculations.

    // 1. Fetch the basket itself
    const basketJsonInfo = await (await fetch(`/current-basket/previous/${basket_id}`, {
      headers: { accept: "application/vnd.api+json" }
    } )).json();
    this.store.pushPayload( basketJsonInfo );
    const basket = this.store.peekRecord('basket', basketJsonInfo.data[0].id);

    // 2. Fetch related information with respect to pricing
    let totalCost = 0;

    for (const orderLine of (await basket.orderLines).toArray()) {
      const offering = await orderLine.get("offering");
      // TODO: verify ember get is necessary in the next two lines
      // eslint-disable-next-line ember/no-get
      const unitPrice = await get(offering, "unitPrice");
      // eslint-disable-next-line ember/no-get
      const amount = await get(orderLine, "amount");
      totalCost += unitPrice.value * amount;
    }

    // 3. Let's calculate the basket again a bit later because it seems
    // like it doesn't update on first render
    setTimeout(async () =>
      this.store.pushPayload(
        await (await fetch(`/current-basket/previous/${basket_id}`, {
          headers: { accept: "application/vnd.api+json" }
        } )).json()
      ),
      1000);

    // 4. Ship the basket as the model
    return { basket, totalCost };
  }
}
