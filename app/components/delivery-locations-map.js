import Component from '@glimmer/component';

export default class DeliveryLocationsMapComponent extends Component {
  get baseZoom() {
    return this.args.baseZoom || 9;
  }

  get baseLat() {
    return this.args.baseLat || 50.874007;
  }

  get baseLng() {
    return this.args.baseLng || 4.689850;
  }
}
