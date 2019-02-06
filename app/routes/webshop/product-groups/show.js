import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class WebshopProductGroupsShowRoute extends Route {
  @service store;
  
  model(params) {
    return this.store.find('product-group', params.id);
  }
}
