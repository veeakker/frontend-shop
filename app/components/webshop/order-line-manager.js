import { get } from '@ember/object';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { use, Resource } from 'ember-could-get-used-to-this';
import OfferingModel from '../../models/offering';
import { captureMessage } from '@sentry/ember';
import {
  UnpackedOfferingsResource,
  AvailableOffersResource,
  OfferTypeResource,
  SupplierResource,
  UNIT_TO_CODE,
  defaultOfferingFromUnpacked
} from '../../utils/offering-configuration';

/**
  Emits the default offering (the smallest C62 offering, falling back to the
  smallest weight offering) whenever the consumer supplied no selectedOffer.

  Resources without update() are created fresh on every recompute, so setup
  sees fresh positional args; adoption is the consumer's responsibility
  (controlled state): the callback is only re-invoked after the consumer
  resets the selectedOffer to undefined.
 */
class NextOfferingResource extends Resource {
  async setup() {
    const [unpackedOfferings, selectedOffer, onDefault] = this.args.positional;

    if (!unpackedOfferings || !onDefault || selectedOffer)
      return;

    // setup runs synchronously inside the render computation that read
    // the args; yielding to the microtask queue lets the consumer's
    // tracked state (selectedOffer) be set after that computation ends.
    await 0;

    const offer = defaultOfferingFromUnpacked(unpackedOfferings);
    if (offer)
      onDefault(offer);
  }
}

/**
  Component to manage OrderLine state.  Helps in creating multiple renderings of the state visualization.
 */
export default class WebshopOrderLineManagerComponent extends Component {
  @use unpackedOfferings = new UnpackedOfferingsResource( () => [this.args.product] );

  @use
  supplier = new SupplierResource( () => [this.args.selectedOffer] )

  @use
  defaultOffering = new NextOfferingResource(
    () => [this.unpackedOfferings, this.args.selectedOffer, this.args.onDefault]
  );

  get selectedOffer() {
    return this.args.selectedOffer;
  }

  get isLoading() {
    return this.unpackedOfferings === undefined;
  }

  get availableOfferings() {
    // Mounting here: @use helpers are created lazily on first read, and the
    // default-emission resource must run even though its value is unused.
    this.defaultOffering;
    return (this.unpackedOfferings || []).filter( (o) => o.enabled );
  }

  get selectedUnit() {
    const selectedOffer = this.args.selectedOffer;
    const typeAndQuantity = selectedOffer && get(selectedOffer, 'typeAndQuantity');
    if (!typeAndQuantity)
      return undefined;
    const unitCode = get(typeAndQuantity, 'unit');
    switch (unitCode) {
      case "C62": return "st";
      case "KGM": return "kg";
      case "GRM": return "g";
      default: return "st";
    }
  }

  @use
  offers = new AvailableOffersResource( () => [this.availableOfferings, this.selectedUnit] );

  @use
  units = new OfferTypeResource( () => [this.availableOfferings] );

  /**
    Quantities for the (quantity, unit) dropdown pair: unlike the offers
    list, which lumps kg and g, constrained to the exact selected unit.
   */
  get quantities() {
    const unitCode = UNIT_TO_CODE[this.selectedUnit];
    const numbers = [];
    const seen = new Set();
    for (const entry of (this.offers || [])) {
      if ( get(entry, 'typeAndQuantity.unit') !== unitCode )
        continue;
      const value = get(entry, 'typeAndQuantity.value');
      if (!seen.has(value)) {
        seen.add(value);
        numbers.push(value);
      }
    }
    return numbers;
  }

  get totalPrice() {
    const offer = this.args.selectedOffer;
    const amount = this.args.amount;
    if (!offer || amount === undefined || amount === null)
      return undefined;

    const unitPrice = get(offer, 'unitPrice');
    const value = unitPrice && get(unitPrice, 'value');
    return value === undefined ? undefined : value * amount;
  }

  @action
  selectOffer(offer) {
    if (offer instanceof OfferingModel) { // clicking to fast may yield an unitialized number component
      this.args.onChange?.(offer);
    } else {
      captureMessage(`Could not select offer ${offer} because it is not an "OfferingModel"`, {
        offer
      });
    }
  }

  /**
    Selects the first offering matching the requested unit and
    dispatches that offering upwards.
   */
  @action
  selectUnit(unit) {
    const unpacked = this.availableOfferings.find( ({unit: unitCode}) =>
      unitCode == UNIT_TO_CODE[unit] );
    if (unpacked)
      this.args.onChange?.(unpacked.offering);
  }
}
