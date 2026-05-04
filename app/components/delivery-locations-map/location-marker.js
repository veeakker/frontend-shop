import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class DeliveryLocationsMapLocationMarkerComponent extends Component {
  // icon settings
  @tracked
  allIconOptions = {
    greenLeaf: {
      iconUrl: '/images/van.png',
      iconSize:     [48, 48],
      shadowSize:   [50, 64],
      iconAnchor:   [20, 20],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -12]
    },
    orangeLeaf: {
      iconUrl: '/images/shop.png',
      iconSize:     [40, 40],
      shadowSize:   [50, 64],
      iconAnchor:   [20, 20],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -12]
    },
    redLeaf: {
      iconUrl: '/images/barn.png',
      iconSize:     [40, 40],
      shadowSize:   [50, 64],
      iconAnchor:   [20, 20],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -12]
    }
  }

  get simpleName() {
    // eslint-disable-next-line ember/no-get
    return get(this.args.place, "deliveryKind.simpleName");
  }

  get iconConfig() {
    // eslint-disable-next-line ember/no-get
    const name = get(this.args.place, "deliveryKind.simpleName");

    if ( name === "toer" )
      return this.allIconOptions.greenLeaf;
    else if ( name === "natuurwinkel" )
      return this.allIconOptions.orangeLeaf;
    else if ( name === "buurderij" )
      return this.allIconOptions.redLeaf;
    else if ( name === "webshop" || name === "winkel" || name === "onbekend" )
      return this.allIconOptions.redLeaf;

    return this.allIconOptions.redLeaf; // cannot be reached
  }
}
