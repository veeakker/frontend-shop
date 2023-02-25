import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class WebshopAccountController extends Controller {
  @tracked editing = false;

  @action
  async finishEditing(event) {
    event.preventDefault();
    const account = this.model;
    // await account.save(); // TODO: save the account and related info through custom service
    const person = await account.person;
    await person.save();
    const postal = await person.postalAddress;
    await postal.save();

    this.editing = false;
  }
}
