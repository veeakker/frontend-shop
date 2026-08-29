import LeafletMap from 'ember-leaflet/components/leaflet-map';
import MaplibreTileLayer from './maplibre-tile-layer';

export default class LeafletMapComponent extends LeafletMap {
  componentsToYield = [
    ...this.componentsToYield,
    { name: 'maplibre-tile-layer', as: 'maplibre', component: MaplibreTileLayer },
  ];
}
