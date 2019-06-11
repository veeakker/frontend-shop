import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class TopMenuComponent extends Component {
  classNames = ["top-menu"]

  mobileOpen = false;

  @computed('mobileOpen')
  get mobileIsOpenClass(){
    return this.mobileOpen && "mobile-open";
  }

  @action
  openNav(){
    this.set('mobileOpen', true);
  }

  @action
  closeNav(){
    this.set('mobileOpen', false);
  }

}
