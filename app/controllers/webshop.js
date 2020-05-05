import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default class WebshopController extends Controller {
  // @sort( "model", ["sortIndex"] ) productGroups;

  @service basket

  @computed( "model.@each.sortIndex" ) get sortedProductGroups() {
    return this.model.sortBy('sortIndex');
  }
}
