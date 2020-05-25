import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
// import { wait } from 'ember-animated';

const wait = function( time ) {
  return new Promise((success) => {
    window.setTimeout( success, time );
  });
};

export default class ProductCardComponent extends Component {
  @tracked showDetail = false;

  packageCount = 1

  tagName = ""

  @tracked selectedOffer = null;

  @service basket

  get firstOffer() {
    return this.args.product && this.args.product.sortedOfferings.firstObject;
  }

  get currentOffer(){
    // It is not clear why we have to base ourselves on the id
    // property in this case, but that seems to make it work.
    if( this.selectedOffer && this.selectedOffer.id ){
      return this.selectedOffer;
    }
    if( this.firstOffer && this.firstOffer.id ){
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
    this.set('showDetail', false);
    await wait(500);
    this.set('selectedOffer', null);
    this.set('packageCount', 1);
  }
}
