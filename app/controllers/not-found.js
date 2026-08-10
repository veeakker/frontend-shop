import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class NotFoundController extends Controller {
  @service session;

  get webshop() {
    return this.session.webshop ?? 'all';
  }
}
