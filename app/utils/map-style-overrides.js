// Colour overrides applied on top of the OpenFreeMap Positron style.
// This is the experimentation surface for the map's look: change a value
// here and it is pushed into the style right after the GL map loads.
//
// Hex values only — MapLibre paint properties cannot read CSS variables,
// so these mirror tokens.scss by hand:
//   copper  #C8955C  (--color-primary)
//   gold    #D4A843  (--color-accent-gold)
//   sage    #7A9B62  (--color-accent-eco)
//   card    #1E1A16  (--color-surface-card, dark)
//   parchment #FAF5EB (--color-surface-card, light)

// Layer ids to hide completely (e.g. to judge the map without them).
// Comment/uncomment entries while experimenting.
export const hiddenLayers = [
  'landcover_wood',
  'park',
  // 'building',
  // 'railway',
  // 'railway_service',
  // 'railway_transit',
];

const lightPalette = {
  // Warm parchment ground instead of Positron's neutral grey
  background: '#F5EFE3',

  // Fields and woods: pull the sage green up so nature reads warmly
  park: '#CBDDB6',
  wood: '#BDD2A4',

  // Water: soft teal instead of Positron's cold blue
  water: '#A8CBD4',
  waterway: '#A8CBD4',

  // Buildings: barely-there warm sand, close to the ground colour
  building: '#EBE2D2',
  buildingOutline: '#E0D4C0',

  // Roads: muted creams and tans that sit quietly on the parchment;
  // motorways keep a hint of copper but toned down
  roadMinor: '#F8F4EA',
  roadMajor: '#E9DBBB',
  motorway: '#DDBE96',
  motorwayCasing: '#C8B18E',

  // Rail: faint warm grey, barely present
  railway: '#D8CEC0',

  // Airport runways/taxiways: quiet sand, one step up from the ground
  aeroway: '#E6DDCA',
  aerowayCasing: '#D9CDB6',

  // Pier / road-on-water surfaces follow the muted road tones
  pier: '#EFE7D5',

  // Boundaries: soft plum so borders are visible but not harsh
  boundary: '#C9A0A8',

  // Labels: chocolate text on a warm halo
  labelText: '#3B2F23',
  labelHalo: '#F5EFE3',
  roadLabel: '#8A7B68',
  waterLabel: '#4E7480',
};

// Dark mode mirrors the site's dark wood surfaces, starting from Carto's
// Dark Matter base and nudging only a few values warmer.
const darkPalette = {
  background: '#131110',

  water: '#182A30',
  waterway: '#182A30',

  building: '#1B1815',
  buildingOutline: '#211D19',

  // Motorway accent: the one warm note on the dark map
  motorway: '#4A382A',

  labelText: '#C9BCA9',
  labelHalo: '#131110',
  waterLabel: '#4E6B75',
};

function overridesFor(palette) {
  return {
    background: { 'background-color': palette.background },

    park: { 'fill-color': palette.park },
    landcover_wood: { 'fill-color': palette.wood },

    water: { 'fill-color': palette.water },
    waterway: { 'line-color': palette.waterway },

    building: {
      'fill-color': palette.building,
      'fill-outline-color': palette.buildingOutline,
    },

    highway_minor: { 'line-color': palette.roadMinor },
    highway_major_inner: { 'line-color': palette.roadMajor },
    highway_major_subtle: { 'line-color': palette.roadMajor },
    highway_motorway_inner: { 'line-color': palette.motorway },
    highway_motorway_subtle: { 'line-color': palette.motorway },
    highway_motorway_casing: { 'line-color': palette.motorwayCasing },
    highway_motorway_bridge_casing: { 'line-color': palette.motorwayCasing },

    tunnel_motorway_inner: { 'line-color': palette.motorway },
    tunnel_motorway_casing: { 'line-color': palette.motorwayCasing },

    railway: { 'line-color': palette.railway },
    railway_service: { 'line-color': palette.railway },
    railway_transit: { 'line-color': palette.railway },

    'aeroway-runway': { 'line-color': palette.aeroway },
    'aeroway-runway-casing': { 'line-color': palette.aerowayCasing },
    'aeroway-taxiway': { 'line-color': palette.aeroway },
    'aeroway-area': { 'fill-color': palette.aeroway },

    road_pier: { 'line-color': palette.pier },
    road_area_pier: { 'fill-color': palette.pier },

    boundary_2: { 'line-color': palette.boundary },
    boundary_3: { 'line-color': palette.boundary },

    waterway_line_label: {
      'text-color': palette.waterLabel,
      'text-halo-color': palette.labelHalo,
    },
    water_name_point_label: {
      'text-color': palette.waterLabel,
      'text-halo-color': palette.labelHalo,
    },
    water_name_line_label: {
      'text-color': palette.waterLabel,
      'text-halo-color': palette.labelHalo,
    },
    'highway-name-minor': {
      'text-color': palette.roadLabel,
      'text-halo-color': palette.labelHalo,
    },
    'highway-name-major': {
      'text-color': palette.roadLabel,
      'text-halo-color': palette.labelHalo,
    },
    'highway-name-path': {
      'text-color': palette.roadLabel,
      'text-halo-color': palette.labelHalo,
    },
    airport: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_other: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_village: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_town: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_state: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_city: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_city_capital: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_country_3: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_country_2: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
    label_country_1: { 'text-color': palette.labelText, 'text-halo-color': palette.labelHalo },
  };
}

// Dark Matter (Carto dark vector style) already starts from a dark base.
// Only nudge a few colours warmer to match the site's wood palette; the
// style's own road/rail/label hierarchy is left intact so it stays quiet.
// Layer ids are Dark Matter's, not Positron's.
const darkOverrides = {
  background: { 'background-color': darkPalette.background },

  water: { 'fill-color': darkPalette.water },
  water_shadow: { 'fill-color': darkPalette.waterway },
  waterway: { 'line-color': darkPalette.waterway },

  building: { 'fill-color': darkPalette.building },
  'building-top': {
    'fill-color': darkPalette.buildingOutline,
    'fill-outline-color': darkPalette.buildingOutline,
  },

  // Motorways only: the single place where a warm accent helps
  road_mot_fill_noramp: { 'line-color': darkPalette.motorway },
  road_mot_fill_ramp: { 'line-color': darkPalette.motorway },
  tunnel_mot_fill: { 'line-color': darkPalette.motorway },
  bridge_mot_fill: { 'line-color': darkPalette.motorway },

  waterway_label: {
    'text-color': darkPalette.waterLabel,
    'text-halo-color': darkPalette.labelHalo,
  },
  watername_ocean: {
    'text-color': darkPalette.waterLabel,
    'text-halo-color': darkPalette.labelHalo,
  },
  watername_sea: {
    'text-color': darkPalette.waterLabel,
    'text-halo-color': darkPalette.labelHalo,
  },
  watername_lake: {
    'text-color': darkPalette.waterLabel,
    'text-halo-color': darkPalette.labelHalo,
  },
  watername_lake_line: {
    'text-color': darkPalette.waterLabel,
    'text-halo-color': darkPalette.labelHalo,
  },
};

export function applyMapStyleOverrides(glMap, theme = 'light') {
  const overrides = theme === 'dark' ? darkOverrides : overridesFor(lightPalette);

  // Only the Positron (light) style has these experimental hides
  if (theme !== 'dark') {
    for (const layerId of hiddenLayers) {
      if (glMap.getLayer(layerId)) glMap.setLayoutProperty(layerId, 'visibility', 'none');
    }
  }

  for (const [layerId, paint] of Object.entries(overrides)) {
    if (!glMap.getLayer(layerId)) continue;
    for (const [property, value] of Object.entries(paint)) {
      glMap.setPaintProperty(layerId, property, value);
    }
  }
}
