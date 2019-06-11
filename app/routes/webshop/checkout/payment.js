import Route from '@ember/routing/route';

export default class WebshopPaymentRoute extends Route {

  setupController( controller ) {
    controller.activate();
  }
}
