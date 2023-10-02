import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { use, Resource } from 'ember-could-get-used-to-this';
import wait from '../utils/wait';

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

const UNIT_TO_CODE = {
  "st": "C62",
  "kg": "KGM",
  "g": "GRM"
};

class AvailableOffersResource extends Resource {
  @tracked value

  async setup() {
    const [offerings,unit] = this.args.positional;

    // console.log({offerings,unit});

    // const offerings = await product.sortedOfferings;

    const results = [];

    if( await offerings )
      for (const offer of offerings) {
        const taq = await offer.typeAndQuantity;
        if (taq.unit == UNIT_TO_CODE[unit])
          results.push(offer);
      }

    // console.log({availableOfferings: results, unit });

    this.value = results;
  }
}

export default class ProductCardComponent extends Component {
  @service store;

  @tracked showDetail = false;

  packageCount = 1

  @tracked selectedOffer = null;
  @tracked selectedUnit = null;

  @service basket

  // @tracked possibleOffers = [];

  constructor() {
    super(...arguments);
    this.asyncInit();
  }

  async asyncInit() {
    const offerings = (await this.args.product.offerings).toArray();

    for( const offering of offerings ) {
      await offering;
      await offering.typeAndQuantity;
    }

    this.selectedUnit = this.currentUnit;
    // console.log({ units: this.units, offers: this.possibleOffers }); // init values
  }

  get currentUnit() {
    if (this.selectedUnit) {
      return this.selectedUnit;
    } else {
      return this.availableUnits?.firstObject;
    }
  }

  get firstOffer() {
    if (this.currentUnit) {
      const unit = this.currentUnit;
      return this
        .args.product?.sortedOfferings?.filter( (offering) =>
          offering?.typeAndQuantity?.get("unit") == UNIT_TO_CODE[unit]
        ).firstObject;
    } else {
      return null;
    }
  }

  get currentOffer(){
    // It is not clear why we have to base ourselves on the id
    // property in this case, but that seems to make it work.
    if( this.selectedOffer?.id ){
      return this.selectedOffer;
    }
    if( this.firstOffer?.id ){
      return this.firstOffer;
    }
    return null;
  }

  get detailClass() {
    return this.showDetail ? "detail" : "";
  }

  @action
  async add() {
    this.basket.addOffer( this.currentOffer, this.packageCount );
    await wait(500);
    this.showDetail = false;
    await wait(500);
    this.selectedOffer = null;
    this.packageCount = 1;
  }

  @action
  selectValue(unit) {
    this.selectedUnit = unit;
    this.selectedOffer = null;
  }

  @use
  possibleOffers = new AvailableOffersResource( () => [this.args.product?.sortedOfferings, this.currentUnit] );

  @use
  units = new OfferTypeResource( () => [this.args.product] )

  get availableUnits() {
    return this.units;
  }
}
