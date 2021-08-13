import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class WebshopController extends Controller {
  // @sort( "model", ["sortIndex"] ) productGroups;

  @service basket

  @tracked loggedIn = false;

  @computed( "model.@each.sortIndex" ) get sortedProductGroups() {
    return this.model.sortBy('sortIndex');
  }
}
