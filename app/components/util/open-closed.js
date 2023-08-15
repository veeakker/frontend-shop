import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class UtilOpenClosedComponent extends Component {
  @tracked forceOpen;

  get isOpen() {
    if ( this.forceOpen === undefined )
      return this.args.defaultOpen;
    else
      return this.forceOpen;
  }

  get makeOpenFn() {
    return () => this.makeOpen();
  }

  makeOpen() {
    this.forceOpen = true;
  }

  makeClosed() {
    this.forceClosed = true;
  }

  defaultOpen() {
    this.forceOpen = undefined;
  }
}
