import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { use, Resource } from 'ember-could-get-used-to-this';
import wait from '../utils/wait';
import OfferingModel from '../models/offering';

const UNIT_TO_CODE = {
  "st": "C62",
  "kg": "KGM",
  "g": "GRM"
};

const CODE_TO_UNIT = {
  "C62": "st",
  "KGM": "kg",
  "GRM": "g"
};

class OfferTypeResource extends Resource {
  @tracked value

  async setup() {
    const product = await this.args.positional[0];
    const offerings = (await product.offerings).toArray();
    await RSVP.all(offerings);
    let typeAndQuantityValues =
      (await RSVP.all(offerings.map((o) => o.typeAndQuantity)))
        .toArray()
        .map((typeAndQuantity) => typeAndQuantity.unit);

    this.value =
      [...new Set(typeAndQuantityValues)]
      .map( (value) => { switch ( value ) {
        case "C62": return "st";
        case "KGM": return "kg";
        case "GRM": return "g";
        default: return "st";
      } } );
  }
}

// Unpack offerings in unit, quantity, offering for easier processing
async function unpackOfferings( offerings ) {
  const rawOfferings = await offerings;
  if (rawOfferings) {
    let unpackedOfferings = [];
    for ( const offer of rawOfferings ) {
      const taq = await offer.typeAndQuantity;
      unpackedOfferings.push( {
        unit: taq.unit,
        quantity: taq.unit == UNIT_TO_CODE["kg"] ? taq.value * 1000 : taq.value,
        offering: offer
      } );
    }
    return unpackedOfferings;
  } else {
    return [];
  }
}

class UnpackedOfferingsResource extends Resource {
  @tracked value;

  async setup() {
    const [offerings] = this.args.positional;
    this.value = await unpackOfferings( offerings );
  }
}

class AvailableOffersResource extends Resource {
  @tracked value

  async setup() {
    const [unpackedOfferings,unit] = this.args.positional;

    // we want KGM and GR to be lumped together, otherwise just C62 (or whatever)
    let offeringUnits = [];
    if ( unit == "kg" || unit == "g" ) {
      offeringUnits = [
        UNIT_TO_CODE["kg"],
        UNIT_TO_CODE["g"]
      ];
    } else {
      offeringUnits = [ UNIT_TO_CODE[unit] ];
    }

    if( await unpackedOfferings ) {
      // filter out the desired units
      const consideredOfferingObjects = unpackedOfferings
        .filter(({unit}) => offeringUnits.includes(unit));

      // sort the offerings
      const sortedOfferingObjects = consideredOfferingObjects
        .sort(({quantity: a}, {quantity: b}) => a > b);

      // extract the desired objects
      const sortedOfferings = sortedOfferingObjects
        .map( ({offering}) => offering );

      this.value = sortedOfferings;
    } else {
      this.value = [];
    }
  }
}

export default class ProductCardComponent extends Component {
  @service store;

  @tracked showDetail = false;

  packageCount = 1

  @tracked selectedOffer = null;

  @service basket

  // @tracked possibleOffers = [];

  constructor() {
    super(...arguments);
    this.asyncInit();
  }

  async asyncInit() {
    this.selectedOffer = await this.defaultOffering();
  }

  async defaultOffering() {
    // TODO: default offering should be a default offering chosen in the backend
    const offerings = (await this.args.product.offerings).toArray();
    const unpacked = await unpackOfferings(offerings);

    // first check the lowest amount of pieces which can be ordered,
    if ( unpacked.find(({unit}) => unit == "C62") ) {
      return unpacked
        .filter(({unit}) => unit == "C62")
        .sort(({quantity: a},{quantity: b}) => a > b)
        .firstObject
        .offering;
    // then check the lowest amount of g or kgfor now
    } else if ( unpacked.find(({unit}) => unit == "GRM" || unit == "KGM") ) {
      return unpacked
        .filter(({unit}) => unit == "GRM" || unit == "KGM")
        .sort(({quantity: a},{quantity: b}) => a > b)
        .firstObject
        .offering;
    // lastly just return the first object because this is weird
    } else {
      console.warn("Just returning the first available offering")
      return unpacked.firstObject?.offering;
    }
  }

  get currentUnit() {
    return CODE_TO_UNIT[this.selectedOffer?.typeAndQuantity?.get("unit")];
  }

  get firstOffer() {
    return this.args.product?.sortedOfferings?.firstObject;
  }

  get detailClass() {
    return this.showDetail ? "detail" : "";
  }

  @action
  async add() {
    if( this.selectedOffer ) {
      this.basket.addOffer( this.selectedOffer, this.packageCount );
      await wait(500);
      this.showDetail = false;
      await wait(500);
      this.selectedOffer = await this.defaultOffering();
      this.packageCount = 1;
    }
  }

  @action
  selectValue(selectedUnit) {
    const firstFoundOffer = this
      .unpackedOfferings?.find( ({unit}) => unit == UNIT_TO_CODE[selectedUnit] )?.offering;

    this.selectedOffer = firstFoundOffer;
  }

  @action
  selectOffer(offer) {
    if (offer instanceof OfferingModel) { // clicking to fast may yield an unitialized number component
      this.selectedOffer = offer;
    }
  }

  // NOTE: we are sorting twice now, our current smarter sorting of
  // possibleOffers should land in sortedOfferings and perhaps that can
  // be made to supply the unpacked variant.
  @use
  unpackedOfferings = new UnpackedOfferingsResource( () => [this.args.product?.sortedOfferings] );

  @use
  possibleOffers = new AvailableOffersResource( () => [this.unpackedOfferings, this.currentUnit] );

  @use
  availableUnits = new OfferTypeResource( () => [this.args.product] )
}
