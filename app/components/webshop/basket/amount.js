import { computed } from '@ember/object';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class AmountComponent extends Component {

  @alias('amount.value') value
  @alias('amount.unit') unit

  tagName = ""

  @computed('unit', 'value')
  get unitString(){
    const unit = this.unit;
    if( unit == "C62" )
      return this.value == 1 ? "stuk" : "stuks";
    if( unit == "KGM" )
      return "kg";
    if( unit == "GRM" )
      return "gr";
    return "---";
  }

  @computed('value', 'unitString')
  get outputString(){
    const value = this.value;

    return `${value} ${this.unitString}`;
  }
}
