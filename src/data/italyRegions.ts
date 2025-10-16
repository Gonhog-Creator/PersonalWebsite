// GeoJSON data for Italy regions with simplified boundaries
export interface RegionProperties {
  name: string;
  id: string;
  galleryPath: string;
}

export interface RegionFeature extends GeoJSON.Feature<GeoJSON.Geometry, RegionProperties> {
  id: string;
}

// Helper function to create a polygon with proper coordinates
const createPolygon = (coordinates: [number, number][]): GeoJSON.Polygon => {
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
};

export const italyRegions: GeoJSON.FeatureCollection<GeoJSON.Geometry, RegionProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'venice',
      properties: {
        name: 'Venice',
        id: 'venice',
        galleryPath: '/galleries/italy/venice'
      },
      geometry: createPolygon([
        [12.0046994, 45.4485913],
        [12.0128249, 45.4346820],
        [12.1223554, 45.3789254],
        [12.1168597, 45.2543525],
        [12.3044008, 45.2219574],
        [12.3160792, 45.2248592],
        [12.3222619, 45.2354979],
        [12.3016530, 45.2369485],
        [12.3112705, 45.2698183],
        [12.3236358, 45.3210186],
        [12.3421838, 45.3229498],
        [12.3449317, 45.3330874],
        [12.3332533, 45.3466014],
        [12.3882104, 45.4150871],
        [12.4411066, 45.4194250],
        [12.4582807, 45.4358094],
        [12.5187335, 45.4565240],
        [12.5867430, 45.4772311],
        [12.6492540, 45.5026399],
        [12.6286451, 45.5276595],
        [12.5922360, 45.5478595],
        [12.5409686, 45.5812173],
        [12.4729592, 45.6182099],
        [12.4241848, 45.6172493],
        [12.2730527, 45.6129267],
        [12.1205468, 45.6081234],
        [12.0394850, 45.5600677],
        [12.0046994, 45.4485913]
      ])
    },
    {
      type: 'Feature',
      id: 'padua',
      properties: {
        name: 'Padua',
        id: 'padua',
        galleryPath: '/galleries/italy/padova/'
      },
      geometry: createPolygon([
        [11.8304974, 45.4732626],
        [11.8023319, 45.4698919],
        [11.7796621, 45.4515907],
        [11.7714185, 45.4347290],
        [11.7535574, 45.4072578],
        [11.7638619, 45.3749500],
        [11.7679837, 45.3595129],
        [11.7769142, 45.3421411],
        [11.7858447, 45.3223501],
        [11.8236277, 45.3194533],
        [11.8387410, 45.3194533],
        [11.8765240, 45.3266950],
        [11.9239245, 45.3324878],
        [11.9582727, 45.3445542],
        [11.9706380, 45.3701264],
        [11.9809425, 45.4053295],
        [11.9699510, 45.4328017],
        [11.9397246, 45.4617053],
        [11.9163679, 45.4703735],
        [11.8304974, 45.4732626]
      ])
    },
    {
      type: 'Feature',
      id: 'trieste',
      properties: {
        name: 'Trieste',
        id: 'trieste',
        galleryPath: '/galleries/italy/trieste/'
      },
      geometry: createPolygon([
        [13.7130925, 45.7116185],
        [13.6555781, 45.6968711],
        [13.6267256, 45.6719269],
        [13.6303482, 45.6330614],
        [13.7213709, 45.5955982],
        [13.7491930, 45.5977602],
        [13.7663671, 45.5907934],
        [13.7794194, 45.5840660],
        [13.8027762, 45.5819034],
        [13.8508636, 45.5852674],
        [13.8518941, 45.5915141],
        [13.8649464, 45.5948775],
        [13.8704421, 45.6097699],
        [13.8920815, 45.6184153],
        [13.9123469, 45.6277796],
        [13.9157817, 45.6340217],
        [13.8762813, 45.6537035],
        [13.8453330, 45.6773263],
        [13.8364025, 45.6972327],
        [13.8288459, 45.7108993],
        [13.8102979, 45.7226451],
        [13.8017108, 45.7336695],
        [13.7879715, 45.7456501],
        [13.7130925, 45.7116185]  // Close the polygon
      ])
    }
  ]
};

// Italy outline GeoJSON - Simplified shape that follows Italy's borders
export const italyOutline: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [[
      // Starting from the northwest (French border)
      [6.7499, 45.9280], // Aosta Valley
      [7.0, 43.8],      // West coast down
      [7.5, 43.7],
      [7.4, 43.3],
      [7.9, 43.2],      // French Riviera border
      [7.5, 43.0],
      [7.6, 42.7],
      [8.7, 43.0],      // Ligurian coast
      [9.2, 44.2],
      [9.7, 44.4],
      [10.0, 44.3],
      [10.2, 44.8],
      [11.0, 44.9],
      [12.0, 45.4],     // Northeast border
      [13.6, 45.6],
      [13.5, 46.5],     // Northern border with Austria/Slovenia
      [13.7, 46.8],
      [13.4, 47.0],
      [12.2, 46.7],
      [12.0, 46.5],
      [12.2, 46.2],
      [13.8, 45.5],
      [13.9, 45.0],
      [13.7, 44.8],
      [13.9, 44.5],
      [15.2, 44.2],
      [15.5, 44.0],
      [16.0, 43.5],
      [16.6, 43.7],
      [17.5, 43.0],
      [18.0, 42.5],
      [18.5, 42.5],
      [18.5, 42.0],
      [18.0, 41.5],
      [17.5, 41.0],
      [16.5, 41.0],
      [16.0, 41.5],
      [15.5, 41.0],
      [15.0, 40.5],
      [15.7, 40.0],
      [15.0, 39.5],
      [17.2, 40.5],
      [18.4, 40.0],
      [18.0, 39.5],
      [17.5, 38.0],
      [16.0, 38.5],
      [15.6, 38.0],
      [15.2, 37.5],
      [15.6, 37.0],
      [15.0, 36.7],
      [14.3, 36.7],
      [13.8, 37.0],
      [12.4, 37.5],
      [12.0, 38.0],
      [11.0, 38.0],
      [10.5, 38.5],
      [10.0, 39.0],
      [9.5, 39.5],
      [9.0, 40.0],
      [8.5, 40.5],
      [8.0, 41.0],
      [7.5, 41.5],
      [7.0, 42.0],
      [6.7, 43.0],
      [6.5, 44.0],
      [6.7, 45.0],
      [6.7499, 45.9280]  // Back to start to close the polygon
    ]]
  }
};

// Map center and bounds for Italy
export const italyMapConfig = {
  center: [41.8719, 12.5674] as [number, number], // Center of Italy
  zoom: 6,
  minZoom: 5,
  maxZoom: 10,
  bounds: [
    [36.6199, 6.7499], // Southwest coordinates
    [47.1154, 18.4802]  // Northeast coordinates
  ] as [[number, number], [number, number]]
};

// Style function for regions with clean, modern styling
export function getRegionStyle(feature: RegionFeature, isHovered: boolean): L.PathOptions {
  return {
    weight: isHovered ? 2 : 1,
    color: '#ffffff',
    fillColor: isHovered ? '#3b82f6' : '#4f46e5',
    fillOpacity: isHovered ? 0.8 : 0.6,
    opacity: 1,
    dashArray: '',
    fillRule: 'evenodd',
    className: 'region-polygon',
    interactive: true
  };
}
