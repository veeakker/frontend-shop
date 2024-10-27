import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import fetch from 'fetch';

export default class WebshopCheckoutPaymentController extends Controller {
  @service
  basket

  @tracked
  deliveredOnTour = false;
  @tracked
  paymentUrl = "";

  async activate() {
    if( !this.deliveredOnTour ) {
      const basketId = this.basket.get('basket.id');

      const requestInfo = {
        body: JSON.stringify({ data: {
          type: "payments",
          attributes: {
            description: "Betaling Veeakker",
            redirectUrl: `http://${(new URL(window.location.href)).host}/webshop/checkout/finish/${basketId}`
          } } } ),
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json"
        } };

      const response = await fetch("/payments", requestInfo);
      const body = await response.json();

      const paymentUrl = body.data?.attributes?.paymentUrl;
      this.paymentUrl = paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // eslint-disable-next-line no-console
        console.error("Payment redirect URL not found");
      }
    }
  }
}
