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

  get labelArray() {
    const enabled = (this.args.product && this.args.product.productLabels || []);
    return [{ uri: "http://veeakker.be/product-labels/d9fa5ad6-0d0e-4990-b8a7-ca3a60eb3a85",
        label: "Frozen",
        image: "/images/product-labels/diepvries.png",
        selected: enabled.includes( "http://veeakker.be/product-labels/d9fa5ad6-0d0e-4990-b8a7-ca3a60eb3a85")
      },
      { uri: "http://veeakker.be/product-labels/fa0d5d40-762e-4f89-ac82-46c1a4ee00bf",
        label: "Natuurpunt",
        image: "/images/product-labels/natuurpunt.png",
        selected: enabled.includes( "http://veeakker.be/product-labels/fa0d5d40-762e-4f89-ac82-46c1a4ee00bf")
      },
      { uri: "http://veeakker.be/product-labels/c9e43e38-3f7f-4116-9817-80bdede3f123",
        label: "PintaFish",
        image: "/images/product-labels/pintafish.png",
        selected: enabled.includes( "http://veeakker.be/product-labels/c9e43e38-3f7f-4116-9817-80bdede3f123")
      }];
  }

  get enabledLabelArray() {
    return this.labelArray.filter(({selected}) => selected);
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
    return ;
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
