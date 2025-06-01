import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class WebshopController extends Controller {
  @service router;
  @service basket;
  @service session;
  @service banner;
  @tracked loggedIn = false;

  @action
  async logout() {
    try {
      await this.session.invalidate('authenticator:mu-semtech');

      this.router.transitionTo('webshop');
    } catch(err){
      this.error = err.errors[0].detail;
    }
  }
}
