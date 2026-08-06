import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TopMenuComponent extends Component {
  @service theme;
  @service session;

  @tracked
  mobileOpen = false;

  get mobileIsOpenClass() {
    return this.mobileOpen && "mobile-open";
  }

  get webshop() {
    return this.session.webshop ?? 'all';
  }

  @action
  openNav(event){
    event.preventDefault();
    this.mobileOpen = true;
  }

  @action
  closeNav(event){
    event.preventDefault();
    this.mobileOpen = false;
  }
}
