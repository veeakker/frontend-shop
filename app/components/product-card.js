import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
// import { wait } from 'ember-animated';

const wait = function( time ) {
  return new Promise((success) => {
    window.setTimeout( success, time );
  });
};

export default class ProductCardComponent extends Component {
  showDetail = false

  packageCount = 1

  tagName = ""

  selectedOffer = null

  @service basket

  @alias('product.sortedOfferings.firstObject')
  firstOffer;

  @computed('firstOffer.id', 'selectedOffer', 'selectedOffer.id')
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
