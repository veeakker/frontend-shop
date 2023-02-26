import Route from '@ember/routing/route';

export default class WebshopCheckoutFinishRoute extends Route {
  async model({basket_id}) {
    return basket_id;
  }
}
