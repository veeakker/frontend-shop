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

  @computed('firstOffer.id', 'selectedOffer.id')
  get currentOffer(){
    // It is not clear why we have to base ourselves on the id
    // property in this case, but that seems to make it work.
    this.get('firstOffer.id'); this.get('selectedOffer.id');
    return this.get('selectedOffer') || this.get('firstOffer');
  }

  @computed('showDetail')
  get detailClass() {
    return this.showDetail ? "detail" : "";
  }

  resetOrder() {
    this.setProperties( {
      packageCount: 1,
      selectedOffer: false
    } );
  }

  @action
  async add() {
    this.basket.addOffer( this.currentOffer, this.packageCount );
    await wait(500);
    this.resetOrder();
  }
}
