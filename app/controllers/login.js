import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WebshopLoginController extends Controller {
  @service session;
  @service basket;

  @tracked email;
  @tracked password;
  @tracked error = [];
  @tracked isLoggedIn = false;

  @action
    async login(event) {
      event.preventDefault();
      this.error = [];

      try {
        await this.session.authenticate('authenticator:mu-semtech', {
          email: this.email,
          password: this.password
        });
        await this.basket.requestMerge();
        this.basket.reloadBasket();
        this.transitionToRoute('webshop');

      } catch(err){
        this.error = err.errors[0].title;
      }
    }
}
