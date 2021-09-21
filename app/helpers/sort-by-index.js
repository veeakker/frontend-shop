import RSVP from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { Resource } from 'ember-could-get-used-to-this';

export default class SortByIndex extends Resource {
  @tracked value

  async setup() {
    let entities = this.args.positional[0];
    const options = Object.assign( {property: "sortIndex"}, this.args.named.options);
    await entities;
    entities = entities.toArray();
    await RSVP.all( entities );
    entities.sortBy(options.property);

    this.value = entities;
  }
}
