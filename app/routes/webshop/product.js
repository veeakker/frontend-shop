import Route from '@ember/routing/route';

export default class WebshopProductRoute extends Route {
  setupController( controller, model ) {
    super.setupController( ...arguments );
    controller.resetOrder();
  }
}
