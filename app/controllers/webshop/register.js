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

  @tracked error = [];
  @tracked success;

  @action
  async register(event) {
    event.preventDefault();
    this.error = [];

    const newAccount = this.store.createRecord('account', {
      email: this.email,
      password: this.password
    });

    try {
      const account = await newAccount.save();

      const address = this.store.createRecord('postal-address', {
        country: this.country,
        locality: this.locality,
        postalCode: this.postalCode,
        streetAddress: this.address
      });
  
      const savedAddress = address.save();

      let savedAccount = await this.store.findRecord('account', account.id, {include: "person", reload: true});

      let person = await savedAccount.person;
      person.firstName = this.firstName;
      person.lastName = this.lastName;
      person.postalAddress = savedAddress;
      person.save();

      this.transitionToRoute('webshop.login');
    } catch(err){
      this.error = err.errors[0].detail;
    }
  }
}
