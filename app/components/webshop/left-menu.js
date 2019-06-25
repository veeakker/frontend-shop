import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  @computed("attrs.productGroup.childGroups.@each.sortIndex", "attrs.productGroup.childGroups.[]")
  get sortedSubGroups(){
    const model = this.attrs.productGroup && this.attrs.productGroup.childGroups;

    if( model && model.sortBy ){
      return model.sortBy('sortIndex');
    } else {
      return [];
    }
  }
});
