import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { use, Resource } from 'ember-could-get-used-to-this';
import Component from '@glimmer/component';

class AwaitResource extends Resource {
  @tracked value;

  async setup() {
    this.value = await this.args.positional[0];
  }
}

export default class WebshopBasketUnavailableOrderLinesComponent extends Component {
  @use resolvedOrderLines = new AwaitResource(() => [this.args.orderLines]);

  /**
   * Order lines that cannot be delivered at the currently
   * chosen delivery location.
   */
  get unavailableAtLocation() {
    return (this.resolvedOrderLines || []).filter((ol) =>
      ol.availableForBasketLocation === false
    );
  }

  /**
   * Order lines whose product or offering has been disabled, i.e.
   * the product is currently not available.
   */
  get currentlyUnavailable() {
    return (this.resolvedOrderLines || []).filter((ol) => {
      const product = get(ol, 'product');
      const offering = get(ol, 'offering');
      return (product && get(product, 'isEnabled') === false) ||
             (offering && get(offering, 'isEnabled') === false);
    });
  }
}