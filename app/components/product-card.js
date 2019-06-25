import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default class ProductCardComponent extends Component {
  showDetail = false

  packageCount = 1

  tagName = ""

  selectedOffer = null

  @alias('attrs.product.sortedOfferings.firstObject')
  firstOffer;

  @computed('firstOffer', 'selectedOffer')
  get currentOffer(){
    return this.selectedOffer || this.firstOffer;
  }

  @computed('showDetail')
  get detailClass() {
    return this.showDetail ? "detail" : "";
  }
}
