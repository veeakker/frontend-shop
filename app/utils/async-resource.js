import { tracked } from '@glimmer/tracking';
import { Resource } from 'ember-could-get-used-to-this';

export default function asyncResource(argsFct, setupFct) {
  class AsyncResource extends Resource {
    @tracked value

    async setup() {
      this.value = await setupFct;
    }
  }

  return new AsyncResource( argsFct );
}
