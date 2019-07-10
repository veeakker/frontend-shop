import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({

  @computed( "productGroup.childGroups.{@each.sortIndex,[]}" )
  get sortedSubGroups(){
    const model = this.productGroup && this.productGroup.childGroups;

    if( model && model.sortBy ){
      return model.sortBy('sortIndex');
    } else {
      return [];
    }
  }
});
