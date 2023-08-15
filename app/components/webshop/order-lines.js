import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class WebshopOrderLinesComponent extends Component {
  @service basket;

  get persistCommentFn() {
    return (orderLine) => this.persistComment(orderLine);
  }

  persistComment( orderLine ) {
    this.basket.persistComment( orderLine, orderLine.comment );
  }
}
