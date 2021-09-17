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
  @tracked isFavourite;

  @service basket
  @service store;
  @service session;


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

  async checkFavourite() {
    let currentUser = await (await this.store.findRecord('account', this.session.data.authenticated.relationships.account.data.id, {include: "person"})).person;
    let favourites = await this.store.findAll('favourite');
    debugger
    for (let i = 0; i < favourites.length; i++) {
      const favourite = await this.store.findRecord('favourite', favourites['content'][i].id, {include: 'person,product', reload: true});

      if (favourite.person.get('id') == currentUser.id && favourite.product.get('id') == this.model.id) {
        debugger
        this.isFavourite = true;
        return
      }
    }

    this.isFavourite = false;
  }

  @action
  async favourite() {
    let currentUser = await (await this.store.findRecord('account', this.session.data.authenticated.relationships.account.data.id, {include: "person"})).person;

    const favourite = this.store.createRecord('favourite', {
      product: this.model,
      person: currentUser    
    });
    try {
      const fav = await favourite.save();
      const savedFav = await this.store.findRecord('favourite', fav.id, {reload: true});
      currentUser.favourites.pushObject(savedFav);
      await currentUser.save();
      this.isFavourite = true;
    } catch(err){
      console.log(err)
      this.transitionToRoute('webshop.login');
    }
  }

  get getUnits() {
    // TODO: Fixen

    return ['KGM', 'G']
    
  }
}
