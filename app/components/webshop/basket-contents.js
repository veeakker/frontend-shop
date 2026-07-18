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

export default class BasketContentsComponent extends Component {
  @use resolvedOrderLines = new AwaitResource(() => [this.args.orderLines]);

  /**
   * Order lines whose product or offering has been disabled, i.e. the
   * product is currently not available. They must be removed (or
   * replaced with an alternative) regardless of the chosen delivery
   * location, so they get their own card above the location card.
   */
  get disabledOrderLines() {
    return (this.resolvedOrderLines || []).filter((ol) => {
      const product = get(ol, 'product');
      const offering = get(ol, 'offering');
      return (product && get(product, 'isEnabled') === false) ||
             (offering && get(offering, 'isEnabled') === false);
    });
  }

  /**
   * Order lines that cannot be ordered from the currently chosen location.
   * "Je volledige mandje" still shows every product (so the total and the
   * list match the rest of the basket); not-available items are surfaced
   * again in their own card.
   */
  get notAtLocationOrderLines() {
    return (this.resolvedOrderLines || []).filter((ol) =>
      get(ol, 'availableForBasketLocation') === false
    );
  }

  get hasUnacceptableOrderLines() {
    return this.args.hasUnacceptableOrderLines;
  }
}