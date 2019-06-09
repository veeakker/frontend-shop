import Controller from '@ember/controller';
import fetch from 'fetch';

export default class WebshopPaymentController extends Controller {
  deliveredOnTour = false;
  paymentUrl = "";

  async activate() {
    if( !this.deliveredOnTour ) {
      const requestInfo = {
        body: JSON.stringify({ data: {
          type: "payments",
          attributes: {
            amount: "1.00",
            description: "Betaling Veeakker",
            redirectUrl: `http://${(new URL(window.location.href)).host}/webshop/checkout/finish`
          } } } ),
        method: "POST",
        headers: { "Content-Type": "application/vnd.api+json" } };

      const response = await fetch("/payments", requestInfo);
      const body = await response.json();

      const paymentUrl = body.data.attributes.paymentUrl;
      this.setProperties({paymentUrl});

      window.location.href = paymentUrl;
    }
  }
}
