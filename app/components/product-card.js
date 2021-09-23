import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { use, Resource } from 'ember-could-get-used-to-this';

const wait = function( time ) {
  return new Promise((success) => {
    window.setTimeout( success, time );
  });
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
        case "GR": return "g";
        default: return "st";
      } } );
  }
}

export default class ProductCardComponent extends Component {
  @service store;

  @tracked showDetail = false;

  packageCount = 1

  @tracked selectedOffer = null;

  @service basket

  get firstOffer() {
    return this.args.product?.sortedOfferings?.firstObject;
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

  @use
  units = new OfferTypeResource( () => [this.args.product] )


  get availableUnits() {
    return this.units;
  }

  // get getUnits() {
  //   // var possibleUnits = [];
  //   // const offerings = this.args.product.offerings;

  //   // TODO: Fixen
  //   // if (offerings != null) {
  //   //   this.args.product.offerings.forEach( async offer => {
  //   //     const unit = this.store.findRecord('type-and-quantity', offer.id);

  //   //     if (!possibleUnits.includes(unit)) {
  //   //       possibleUnits.push(unit);
  //   //     }
  //   //   });
  //   // }

  //   return ['KGM', 'G'];
  // }
}
