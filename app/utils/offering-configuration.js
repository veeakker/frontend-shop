import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { Resource } from 'ember-could-get-used-to-this';

export const UNIT_TO_CODE = {
  "st": "C62",
  "kg": "KGM",
  "g": "GRM"
};

export const CODE_TO_UNIT = {
  "C62": "st",
  "KGM": "kg",
  "GRM": "g"
};

// Unpack offerings in unit, quantity, offering, enabled for easier processing
export async function unpackOfferings( offerings ) {
  const rawOfferings = await offerings;
  if (rawOfferings) {
    let unpackedOfferings = [];
    for ( const offer of rawOfferings ) {
      const taq = await offer.typeAndQuantity;
      unpackedOfferings.push( {
        unit: taq.unit,
        quantity: taq.unit == UNIT_TO_CODE["kg"] ? taq.value * 1000 : taq.value,
        offering: offer,
        enabled: offer.isEnabled
      } );
    }
    return unpackedOfferings;
  } else {
    return [];
  }
}

/**
  Chooses the best default offering from a set of unpacked offerings:
  first the lowest amount of pieces, then the lowest amount of grams or
  kilograms, and lastly the first available one.
 */
export function defaultOfferingFromUnpacked( unpacked ) {
  if ( unpacked.find(({unit}) => unit == "C62") ) {
    return unpacked
      .filter(({unit}) => unit == "C62")
      .sort(({quantity: a}, {quantity: b}) => a - b)[0]
      ?.offering;
  } else if ( unpacked.find(({unit}) => unit == "GRM" || unit == "KGM") ) {
    return unpacked
      .filter(({unit}) => unit == "GRM" || unit == "KGM")
      .sort(({quantity: a}, {quantity: b}) => a - b)[0]
      ?.offering;
  } else {
    return unpacked[0]?.offering;
  }
}

export class UnpackedOfferingsResource extends Resource {
  @tracked value;

  async setup() {
    const [product] = await this.args.positional;
    if (!product) {
      this.value = [];
      return;
    }

    // The product may arrive through an async belongsTo (e.g. from an
    // orderLine), which is then a proxy: reading .offerings off it directly
    // throws; awaiting the proxy first yields the underlying model.
    const actualProduct = await product;
    const offerings = await RSVP.all( (await actualProduct.offerings).toArray() );

    this.value = await unpackOfferings( offerings );
  }
}

export class AvailableOffersResource extends Resource {
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
        .sort(({quantity: a}, {quantity: b}) => a - b);

      // extract the desired objects
      const sortedOfferings = sortedOfferingObjects
        .map( ({offering}) => offering );

      this.value = sortedOfferings;
    } else {
      this.value = [];
    }
  }
}

export class OfferTypeResource extends Resource {
  @tracked value

  async setup() {
    const units = [...new Set(
      (this.args.positional[0] || [])
        .map(({unit}) => unit ))];

    this.value = [
      units.find((x) => x == "C62") && "st",
      units.find((x) => x == "GRM") && "g",
      units.find((x) => x == "KGM") && "kg"
    ].filter((x) => x);
  }
}

export class SupplierResource extends Resource {
  @tracked value

  async setup() {
    const [offer] = await this.args.positional;
    if ( offer ) {
      const supplier = await offer.supplier;
      this.value = supplier;
    }
  }
}
