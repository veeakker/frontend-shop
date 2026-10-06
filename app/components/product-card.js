import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { use } from 'ember-could-get-used-to-this';
import wait from '../utils/wait';
import { UnpackedOfferingsResource, SupplierResource } from '../utils/offering-configuration';

export default class ProductCardComponent extends Component {
  @service basket

  // NOTE: tracked so steppers keep the rendered value in sync
  @tracked packageCount = 1;

  @tracked selectedOffer = null;

  @tracked showDetail = false;

  @use
  unpackedOfferings = new UnpackedOfferingsResource( () => [this.args.product] );

  @use
  supplier = new SupplierResource( () => [this.selectedOffer] )

  get detailClass() {
    return this.showDetail ? "detail" : "";
  }

  get basketCount() {
    const orderLines = this.basket.orderLinesR;
    if (!orderLines?.length) return 0;

    const myOfferingIds = new Set(
      (this.unpackedOfferings || []).map(o => o.offering?.id).filter(Boolean)
    );
    if (!myOfferingIds.size) return 0;

    return orderLines
      .filter(line => myOfferingIds.has(line.belongsTo('offering').id()))
      .reduce((sum, line) => sum + (line.amount || 0), 0);
  }

  /**
    The manager dispatches the offering which should be shown; the card
    owns the authoritative state for it.

    This is used for both user-driven changes (onChange) and for the
    default offering which the manager resolves when we did not supply
    one ourselves (onDefault).
   */
  @action
  updateConfiguration(offer) {
    this.selectedOffer = offer;
  }

  @action
  async add() {
    if( this.selectedOffer ) {
      this.basket.addOffer( this.selectedOffer, this.packageCount );
      await wait(500);
      this.showDetail = false;
      await wait(500);
      // the manager re-emits the default offering through adoptDefaultOffer
      this.selectedOffer = null;
      this.packageCount = 1;
    }
  }
}
