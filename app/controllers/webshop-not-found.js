import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class WebshopNotFoundController extends Controller {
  @service session;

  get webshop() {
    return this.session.webshop ?? 'all';
  }
}
