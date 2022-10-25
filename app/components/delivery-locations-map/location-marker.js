import { get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class DeliveryLocationsMapLocationMarkerComponent extends Component {
  // icon settings
  @tracked
  allIconOptions = {
    greenLeaf: {
      iconUrl: '/images/van.png',
      //shadowUrl: '/images/leaf-shadow.png',
      iconSize:     [48, 48], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    },
    orangeLeaf: {
      iconUrl: '/images/shop.png',
      //shadowUrl: '/images/leaf-shadow.png',
      iconSize:     [40, 40], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    },
    redLeaf: {
      iconUrl: '/images/barn.png',
      //shadowUrl: '/images/leaf-shadow.png',
      iconSize:     [40, 40], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    }
  }

  get simpleName() {
    return get(this.args.place, "deliveryKind.simpleName");
  }

  get iconConfig() {
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
