import Component from '@glimmer/component';
import { action } from '@ember/object';


export default class ProductCardOfferTypeComponent extends Component {
  @action
  selectValue(unit) {
    this.args.onChange( unit );
  }
}
