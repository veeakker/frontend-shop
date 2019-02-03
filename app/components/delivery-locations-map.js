import Component from '@ember/component';

export default class DeliveryLocationsMapComponent extends Component {
  // configuration
  tagName = "";

  // default values
  baseLat = 50.874007;
  baseLng = 4.689850;
  baseZoom = 9;


  // leaf icon settings
  iconSettings = {
    iconUrl: '/images/leaf-green.png',
    shadowUrl: '/images/leaf-shadow.png',
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  }
  orangeLeafUrl = '/images/leaf-orange.png';
  redLeafUrl = '/images/leaf-red.png';
}
