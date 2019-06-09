import Controller from '@ember/controller';
import { sort } from '@ember-decorators/object/computed';
import { computed } from '@ember-decorators/object';

export default class WebshopProductGroupsController extends Controller {
  productGroupsSorting = ["sortIndex"];

  @sort( "model", "sortIndex" ) productGroups;

  @computed( "model.@each.sortIndex" ) get sortedProductGroups() {
    return this.get('model').sortBy('sortIndex');
  }
}
