import Component from '@ember/component';

export default class VeeakkerHomeMapComponent extends Component {
  classNames = ['veeakker-home-map__leaflet-map']

  lat = 50.874007
  lng = 4.689850
  zoom = 12

  veeakkerButchery = [50.874007, 4.689850]
}
