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

  get tileUrl() {
    // Both themes use light_all: dark mode inverts it via CSS for high contrast,
    // light mode darkens it via CSS filter. dark_all tiles are too low-contrast.
    return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  }
}
