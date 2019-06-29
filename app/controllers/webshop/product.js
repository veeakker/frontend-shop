import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

const wait = function( time ) {
  return new Promise((success) => {
    window.setTimeout( success, time );
  });
};

export default class WebshopProductController extends Controller {
  packageCount = 1

  tagName = ""

  selectedOffer = null

  @service basket

  @alias('model.sortedOfferings.firstObject')
  firstOffer;

  @computed('firstOffer', 'selectedOffer')
  get currentOffer(){
    return this.selectedOffer || this.firstOffer;
  }

  @computed('showDetail')
  get detailClass() {
    return this.showDetail ? "detail" : "";
  }

  resetOrder() {
    this.setProperties( {
      packageCount: 1,
      selectedOffer: null
    } );
  }

  @action
  async add() {
    this.basket.addOffer( this.currentOffer, this.packageCount );
    await wait(500);
    this.resetOrder();
  }
}
