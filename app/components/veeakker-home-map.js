import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class VeeakkerHomeMapComponent extends Component {
  // Configuration of butchery location
  // (popup marker content is in the template)

  butcheryLat = 50.79006
  butcheryLng = 4.93802
  defaultZoom = 12

  @tracked veeakkerButcheryLocation;

  constructor() {
    super(...arguments);
    this.veeakkerButcheryLocation = [this.butcheryLat, this.butcheryLng];
  }
}
