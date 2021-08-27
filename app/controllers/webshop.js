import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WebshopController extends Controller {
  // @sort( "model", ["sortIndex"] ) productGroups;

  @service basket;
  @service session;
  @tracked loggedIn = false;

  @computed( "model.@each.sortIndex" ) get sortedProductGroups() {
    return this.model.sortBy('sortIndex');
  }

  @action 
  async logout() {
    try {
      await this.session.invalidate('authenticator:mu-semtech');
    } catch(err){
      this.error = err.errors[0].detail;
    }
  }
}
