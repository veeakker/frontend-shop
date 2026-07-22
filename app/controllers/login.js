import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WebshopLoginController extends Controller {
  @service router;
  @service session;
  @service basket;

  @tracked email;
  @tracked password;
  @tracked error = [];
  @tracked isLoggedIn = false;

  // `afterLoginRoute` is a route name; `afterLoginModel` is a comma-joined
  // list of dynamic segments, outermost first, in the order
  // `transitionTo` accepts.
  queryParams = ['afterLoginRoute', 'afterLoginModel'];
  @tracked afterLoginRoute = null;
  @tracked afterLoginModel = null;

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

        if (this.afterLoginRoute) {
          const models = this.afterLoginModel
            ? this.afterLoginModel.split(',').filter(Boolean)
            : [];
          this.router.transitionTo(this.afterLoginRoute, ...models);
        } else {
          this.router.transitionTo('webshop');
        }
      } catch(err){
        this.error = err.errors[0].title;
      }
    }
}
