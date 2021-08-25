import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WebshopRegisterController extends Controller {
  @service store;
  @service session;

  @tracked email;
  @tracked password;
  @tracked error = [];
  @tracked success;

  @action
  async register(event) {
    event.preventDefault();
    this.error = [];
    this.success = false;

    const newAccount = this.store.createRecord('account', {
      email: this.email,
      password: this.password
    });

    try {
      const account = await newAccount.save();

      if(account){
        this.email = '';
        this.password = '';
        this.success  = true;
      }
    } catch(err){
      this.error = err.errors[0].detail;
    }
  }
}
