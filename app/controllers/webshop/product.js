import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RSVP from 'rsvp';
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
        case "GRM": return "g";
        default: return "st";
      } } );
  }
}

export default class WebshopProductController extends Controller {
  @tracked packageCount = 1;

  @tracked selectedOffer = null;
  @tracked favouriteRecord = null;
  @tracked possibleOffers = [];

  @service basket;
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
    this.packageCount = 1;
    this.selectedOffer = false;
  }

  @action
  async add() {
    this.basket.addOffer( this.currentOffer, this.packageCount );
    await wait(500);
    this.resetOrder();
  }

  async checkFavourite() {
    try {
      let currentUser = await (await this.store.findRecord('account', this.session.data.authenticated.relationships.account.data.id, { include: "person" })).person;
      let favourites = await this.store.findAll('favourite');

      for (let i = 0; i < favourites.length; i++) {
        const favourite = await this.store.findRecord('favourite', favourites['content'][i].id, { include: 'person,product', reload: true });

        if (favourite.person.get('id') == currentUser.id && favourite.product.get('id') == this.model.id) {
          this.favouriteRecord = favourite;
          return;
        }
      }
      this.favouriteRecord = null;
    } catch (e) {
      this.favouriteRecord = null;
    }
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
      this.favouriteRecord = fav;
    } catch(err){
      this.transitionToRoute('login');
    }
  }

  @action
  async unFavourite() {
    let currentFav = this.store.peekRecord('favourite', this.favouriteRecord.id);
    await currentFav.destroyRecord();
    this.favouriteRecord = null;
  }

  @action
  selectValue(unit) {
    this.selectedUnit = unit;
    this.updateOffers(unit)
  }

  async updateOffers(unit) {
    var units = {
      "c62": "st",
      "KGM": "kg",
      "GRM": "g"
    };
    const offerings = await this.model.offerings
    this.possibleOffers = [];
    
    
    offerings.forEach(offer => {
      if ( units[offer.typeAndQuantity.get('unit')] == unit) {
        this.possibleOffers.push(offer);
      }
    });
  }


  @use
  units = new OfferTypeResource( () => [this.model] )

  get availableUnits() {
    return this.units;
  }
}
