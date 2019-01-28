import Component from '@ember/component';

export default class VeeakkerHomeMapComponent extends Component {
  classNames = ['veeakker-home-map__leaflet-map']

  // Configuration of butchery location
  // (popup marker content is in the template)
  butcheryLat = 50.874007
  butcheryLng = 4.689850
  defaultZoom = 12

  init() {
    super.init(...arguments);
    this.set('veeakkerButcheryLocation', [this.butcheryLat, this.butcheryLng]);
  }
}
