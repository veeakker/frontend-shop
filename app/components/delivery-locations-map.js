import Component from '@glimmer/component';

export default class DeliveryLocationsMapComponent extends Component {
  get bounds() {
    const ul = this.args.userLocation;

    // 1. Specific place selected — fit to show both the place and the user's
    //    home location when known, otherwise a fixed box around the place.
    if (this.args.baseLat && this.args.baseLng) {
      const plat = parseFloat(this.args.baseLat), plng = parseFloat(this.args.baseLng);
      if (ul) {
        return [
          [Math.min(plat, ul[0]), Math.min(plng, ul[1])],
          [Math.max(plat, ul[0]), Math.max(plng, ul[1])]
        ];
      }
      const d = 0.04;
      return [[plat - d, plng - d], [plat + d, plng + d]];
    }

    // 2. List item focused via click — same two-point logic.
    const fl = this.args.focusedLocation;
    if (fl) {
      if (ul) {
        return [
          [Math.min(fl[0], ul[0]), Math.min(fl[1], ul[1])],
          [Math.max(fl[0], ul[0]), Math.max(fl[1], ul[1])]
        ];
      }
      const d = 0.02;
      return [[fl[0] - d, fl[1] - d], [fl[0] + d, fl[1] + d]];
    }

    // 3. Places loaded — fit all markers plus home location when known
    const coords = (this.args.places || [])
      .map(p => p.geoCoordinate?.get('location')).filter(Boolean);
    if (coords.length > 0) {
      const lats = coords.map(c => parseFloat(c[0]));
      const lngs = coords.map(c => parseFloat(c[1]));
      if (ul) { lats.push(ul[0]); lngs.push(ul[1]); }
      return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
    }

    // 4. No places yet — centre on user area or Belgium
    if (ul) {
      const d = 0.15;
      return [[ul[0] - d, ul[1] - d], [ul[0] + d, ul[1] + d]];
    }

    return [[49.5, 2.5], [51.5, 6.5]];
  }

  get homeIconHtml() {
    return `<div class="home-location-marker"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48"><path d="M18,0 C8.06,0 0,8.06 0,18 C0,31.5 18,48 18,48 C18,48 36,31.5 36,18 C36,8.06 27.94,0 18,0 Z" fill="#C8955C" stroke="white" stroke-width="1.5"/><polygon points="18,8 9,17 12.5,17 12.5,27 23.5,27 23.5,17 27,17" fill="white"/><rect x="15" y="21" width="6" height="6" fill="#C8955C"/></svg></div>`;
  }

  get tileUrl() {
    // Both themes use light_all: dark mode inverts it via CSS for high contrast,
    // light mode darkens it via CSS filter. dark_all tiles are too low-contrast.
    return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  }
}
