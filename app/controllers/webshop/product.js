import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

const wait = function( time ) {
  return new Promise((success) => {
    window.setTimeout( success, time );
  });
};

export default class WebshopProductController extends Controller {
  @tracked
  packageCount = 1

  @tracked
  selectedOffer = null

  @service basket

  get firstOffer(){
    return this.model.sortedOfferings && this.model.sortedOfferings.firstObject;
  }

  get currentOffer(){
    // It is not clear why we have to base ourselves on the id
    // property in this case, but that seems to make it work.
    if( this.selectedOffer && this.selectedOffer.id )
      return this.selectedOffer;
    if( this.firstOffer && this.firstOffer.id )
      return this.firstOffer;
    return null;
  }

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

  get getUnits() {
    // TODO: Fixen

    return ['KGM', 'G']
    
  }
}
