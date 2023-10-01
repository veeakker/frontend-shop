import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WebshopRegisterController extends Controller {
  @service store;
  @service session;

  @tracked firstName;
  @tracked lastName;
  @tracked email;
  @tracked password;

  @tracked country = "Belgium";
  @tracked locality;
  @tracked postalCode;
  @tracked address;
  @tracked telephone;

  @tracked errors = [];
  @tracked success;

  @action
  async register(event) {
    event.preventDefault();
    this.error = [];

    try {
      const response = await fetch( "/accounts", {
        method: "POST",
        headers: {
          accept: "application/vnd.api+json",
          "content-type": "application/vnd.api+json"
        },
        body: JSON.stringify({
          data: {
            attributes: {
              email: this.email,
              password: this.password,
              "first-name": this.firstName,
              "last-name": this.lastName,
              "street-address": this.address,
              locality: this.locality,
              postal: this.postalCode,
              phone: this.telephone
            }
          }
        })});

      if( ! response.ok ) {
        throw await response.json();
      }
      this.transitionToRoute('login');
    } catch(err){
      this.errors = err.errors;
    }
  }
}
