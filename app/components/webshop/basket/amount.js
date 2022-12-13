import { get } from '@ember/object';
import Component from '@glimmer/component';

export default class AmountComponent extends Component {

  get value() {
    return get(this.args, "amount.value");
  }

  get unit() {
    return get(this.args, "amount.unit");
  }

  tagName = ""

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

  get outputString(){
    const value = this.value;

    return `${value} ${this.unitString}`;
  }
}
