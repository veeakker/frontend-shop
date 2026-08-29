import 'maplibre-gl/dist/maplibre-gl.css';
import { inject as service } from '@ember/service';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import TileLayer from 'ember-leaflet/components/tile-layer';
import { applyMapStyleOverrides } from '../utils/map-style-overrides';

export default class MaplibreTileLayerComponent extends TileLayer {
  @service theme;

  leafletRequiredOptions = [];

  // Dark Matter is the Carto dark vector base; warming it up happens in
  // map-style-overrides.js (darkOverrides).
  baseStyles = {
    light: 'https://tiles.openfreemap.org/styles/positron',
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  };

  createLayer() {
    return maplibreGL({
      style: this.baseStyles[this.theme.effectiveTheme],
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
  }

  didCreateLayer() {
    super.didCreateLayer();
    const glMap = this._layer?.getMaplibreMap?.();
    glMap?.on('load', () => {
      this._applyOverrides(glMap);

      // Theme toggle switches the whole base style, not just paint colours
      this._themeObserver = new MutationObserver(() => {
        glMap.setStyle(this.baseStyles[this.theme.effectiveTheme]);
        glMap.once('idle', () => this._applyOverrides(glMap));
      });
      this._themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    });
  }

  willDestroyLayer() {
    this._themeObserver?.disconnect();
    delete this._themeObserver;
    super.willDestroyLayer();
  }

  _applyOverrides(glMap) {
    applyMapStyleOverrides(glMap, this.theme.effectiveTheme);
  }
}
