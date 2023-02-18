import { set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Model, { attr, belongsTo } from '@ember-data/model';
import { use, Resource } from 'ember-could-get-used-to-this';

class EnsureAddressResource extends Resource {
  @tracked value = null;
  @service store;

  async setup() {
    const address = this.args.positional[0];
    if (await address.postalAddress)
      this.value = await address.postalAddress;
    else
      this.value = set(address,"postalAddress", this.store.createRecord('postal-address'));
  }
}

export default class FullAddressModel extends Model {
  @attr('string') name;
  @attr('string') company;
  @attr('string') telephone;
  @attr('string') email;
  @belongsTo('postal-address') postalAddress;

  @use
  address = new EnsureAddressResource(() => [this]);

  async deepPersist() {
    await this.address?.save();
    await this.save();
  }
}
