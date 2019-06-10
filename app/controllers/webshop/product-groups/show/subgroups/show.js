import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default class WebshopProductGroupsShowSubgroupsShowController extends Controller {
  @computed("model.childGroups.@each.sortIndex", "model.childGroups.[]") get sortedSubGroups(){
    const model = this.get('model.childGroups');

    if( model.sortBy ){
      return model.sortBy('sortIndex');
    } else {
      return [];
    }
  }
}
