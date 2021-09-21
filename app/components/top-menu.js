import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TopMenuComponent extends Component {
  @tracked
  mobileOpen = false;

  get mobileIsOpenClass() {
    return this.mobileOpen && "mobile-open";
  }

  @action
  openNav(){
    this.mobileOpen = true;
  }

  @action
  closeNav(){
    this.mobileOpen = false;
  }

}
