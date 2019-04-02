import { computed } from '@ember-decorators/object';
import { sort } from '@ember-decorators/object/computed';
import Controller from '@ember/controller';

export default class WebshopController extends Controller {
  // @sort( "model", ["sortIndex"] ) productGroups;

  @computed( "model.@each.sortIndex" ) get sortedProductGroups() {
    return this.get('model').sortBy('sortIndex');
  }
}
