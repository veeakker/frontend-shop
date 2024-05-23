import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class WebshopAccountController extends Controller {
  @tracked saved = false

  @action
  async save(event) {
    event.preventDefault();
    const account = this.model;
    await account.save();
    const person = await account.person;
    await person.save();
    const postal = await person.postalAddress;
    await postal.save();
    this.saved = true;
  }

  activate() {
    alert("yo");
    this.saved = false;
  }
}
