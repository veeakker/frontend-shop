import Component from '@ember/component';
import { computed } from '@ember/object';

export default class DeliveryLocationsMapLocationMarkerComponent extends Component {
  // icon settings
  allIconOptions = {
    greenLeaf: {
      iconUrl: '/images/leaf-green.png',
      shadowUrl: '/images/leaf-shadow.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    },
    orangeLeaf: {
      iconUrl: '/images/leaf-orange.png',
      shadowUrl: '/images/leaf-shadow.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    },
    redLeaf: {
      iconUrl: '/images/leaf-red.png',
      shadowUrl: '/images/leaf-shadow.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    }
  }

  @computed('place.deliveryKind.simpleName') get simpleName(){
    return this.get('place.deliveryKind.simpleName');
  }

  @computed('simpleName') get iconConfig(){
    const name = this.get('place.deliveryKind.simpleName');

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
