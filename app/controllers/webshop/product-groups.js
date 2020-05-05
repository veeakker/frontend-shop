import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';

export default class WebshopProductGroupsController extends Controller {
  productGroupsSorting = ["sortIndex"];

  @sort( "model", "sortIndex" ) productGroups;

  @computed( "model.@each.sortIndex" ) get sortedProductGroups() {
    return this.model.sortBy('sortIndex');
  }
}
