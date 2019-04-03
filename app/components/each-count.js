import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

export default class EachCountComponent extends Component {
  tagName = ""

  @computed("count")
  get eachArray() {
    const arr = [];
    for( let idx = 0; idx < ( this.count || 0 ); idx ++ )
      arr.push( idx );
    return arr;
  }
}
