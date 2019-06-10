import { computed } from '@ember/object';
import Component from '@ember/component';

export default class ProductCardComponent extends Component {
  showDetail = false

  packageCount = 1
  packageAmount = 1

  tagName = ""

  @computed('showDetail')
  get detailClass() {
    return this.showDetail ? "detail" : "";
  }
}
