import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { get } from '@ember/object';
import Model, { hasMany, attr, belongsTo } from '@ember-data/model';
import { use, Resource } from 'ember-could-get-used-to-this';

class EnsureAddressResource extends Resource {
  @tracked value = null;
  @service store;

  async setup() {
    const basket = this.args.positional[0];
    const property = this.args.positional[1];
    if ( await get(basket, property) )
      this.value = await get(basket, property);
    else
      this.value = set(basket, property, this.store.createRecord('full-address'));
  }
}

export default class BasketModel extends Model {
  @attr() paymentStatus;
  @attr('boolean') hasCustomDeliveryPlace;
  @attr() deliveryType;
  @hasMany('order-line') orderLines;
  @belongsTo('delivery-place') deliveryPlace;
  @belongsTo('fullAddress') deliveryAddress;
  @belongsTo('fullAddress') invoiceAddress;
  @belongsTo('person') customer;

  get delivery() {
    return this.deliveryAddress;
  }

  get invoice() {
    return this.invoiceAddress;
  }

  // @use
  // delivery = new EnsureAddressResource(() => [this, "deliveryAddress"]);

  // @use
  // invoice = new EnsureAddressResource(() => [this, "invoiceAddress"]);

  // async deepPersist() {
  //   await this.delivery?.deepPersist();
  //   await this.invoice?.deepPersist();
  //   await this.save();
  // }
}
