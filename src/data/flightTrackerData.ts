export interface FlightLocation {
  key: string;
  label: string;
  lat: number;
  lon: number;
}

export interface Flight {
  from: string;
  to: string;
  year: number;
}

export interface YearGroup {
  year: number;
  color: string;
  flights: Flight[];
}

export const locations: FlightLocation[] = [
  { key: 'RDU', label: 'Raleigh-Durham (RDU)', lat: 35.8776, lon: -78.7875 },
  { key: 'MIA', label: 'Miami (MIA)', lat: 25.7959, lon: -80.2870 },
  { key: 'EZE', label: 'Buenos Aires/Ezeiza (EZE)', lat: -34.8222, lon: -58.5358 },
  { key: 'JFK', label: 'New York/JFK', lat: 40.6413, lon: -73.7781 },
  { key: 'BOS', label: 'Boston (BOS)', lat: 42.3656, lon: -71.0096 },
  { key: 'SEA', label: 'Seattle (SEA)', lat: 47.4502, lon: -122.3088 },
  { key: 'ATL', label: 'Atlanta (ATL)', lat: 33.6407, lon: -84.4277 },
  { key: 'IGR', label: 'Iguazú Falls (IGR)', lat: -25.7373, lon: -54.4734 },
  { key: 'AEP', label: 'Buenos Aires/Newbery (AEP)', lat: -34.5592, lon: -58.4156 },
  { key: 'FTE', label: 'El Calafate (FTE)', lat: -50.2803, lon: -72.0538 },
  { key: 'SFO', label: 'San Francisco (SFO)', lat: 37.6213, lon: -122.3790 },
  { key: 'MEL', label: 'Melbourne (MEL)', lat: -37.6733, lon: 144.8430 },
  { key: 'ADL', label: 'Adelaide (ADL)', lat: -34.9450, lon: 138.5306 },
  { key: 'ASP', label: 'Alice Springs (ASP)', lat: -23.8067, lon: 133.9019 },
  { key: 'SYD', label: 'Sydney (SYD)', lat: -33.9399, lon: 151.1753 },
  { key: 'BNE', label: 'Brisbane (BNE)', lat: -27.3942, lon: 153.0878 },
  { key: 'DXB', label: 'Dubai (DXB)', lat: 25.2532, lon: 55.3657 },
  { key: 'LHR', label: 'London/Heathrow (LHR)', lat: 51.4700, lon: -0.4614 },
  { key: 'ATH', label: 'Athens (ATH)', lat: 37.9364, lon: 23.9445 },
  { key: 'KGS', label: 'Kos Island (KGS)', lat: 36.7933, lon: 27.0917 },
  { key: 'CDG', label: 'Paris/CDG', lat: 49.0097, lon: 2.5479 },
  { key: 'ZUR', label: 'Zurich (ZRH)', lat: 47.4647, lon: 8.5492 },
  { key: 'MAD', label: 'Madrid (MAD)', lat: 40.4983, lon: -3.5676 },
  { key: 'GLA', label: 'Glasgow (GLA)', lat: 55.8656, lon: -4.2514 },
  { key: 'EDI', label: 'Edinburgh (EDI)', lat: 55.9508, lon: -3.3615 },
  { key: 'SJO', label: 'San José, Costa Rica (SJO)', lat: 9.9982, lon: -84.2042 },
  { key: 'DFW', label: 'Dallas/Fort Worth (DFW)', lat: 32.8998, lon: -97.0404 },
  { key: 'DEN', label: 'Denver (DEN)', lat: 39.8561, lon: -104.6737 },
  { key: 'PHL', label: 'Philadelphia (PHL)', lat: 39.8744, lon: -75.2424 },
  { key: 'VCE', label: 'Venice (VCE)', lat: 45.5051, lon: 12.3519 },
  { key: 'SLA', label: 'Salta (SLA)', lat: -24.8560, lon: -65.4861 },
  { key: 'PRG', label: 'Prague (PRG)', lat: 50.1008, lon: 14.2632 },
  { key: 'CPH', label: 'Copenhagen (CPH)', lat: 55.6181, lon: 12.6561 },
  { key: 'GRU', label: 'São Paulo/Guarulhos (GRU)', lat: -23.4356, lon: -46.4731 },
  { key: 'LAD', label: 'Luanda (LAD)', lat: -8.8583, lon: 13.2312 },
  { key: 'CLT', label: 'Charlotte (CLT)', lat: 35.2144, lon: -80.9473 },
  { key: 'PMO', label: 'Palermo (PMO)', lat: 38.1818, lon: 13.0990 },
  { key: 'CTA', label: 'Catania (CTA)', lat: 37.4668, lon: 15.0664 },
  { key: 'FLR', label: 'Florence (FLR)', lat: 43.7699, lon: 11.2056 },
  { key: 'FCO', label: 'Rome/Fiumicino (FCO)', lat: 41.8003, lon: 12.2389 },
  { key: 'DUB', label: 'Dublin (DUB)', lat: 53.4264, lon: -6.2499 },
];

const locationMap = new Map(locations.map((l) => [l.key, l]));

const keywords: Record<string, string[]> = {
  RDU: ['rdu'],
  MIA: ['miami', 'mia', 'mismo'],
  EZE: ['eze', 'ezeiza'],
  JFK: ['jfk', 'jkf', 'john f kennedy'],
  BOS: ['boston'],
  SEA: ['seattle', 'sea'],
  ATL: ['atlanta', 'atl'],
  IGR: ['iguazu', 'iguana', 'iguana fall', 'falls area', 'northern argentina'],
  AEP: ['newbery', 'newbeery', 'newberry', 'jorge newbery'],
  FTE: ['calafate', 'perito moreno', 'el calafate'],
  SFO: ['san francisco', 'san fransisco', 'sfo'],
  MEL: ['melbourne'],
  ADL: ['adelaide'],
  ASP: ['alice springs'],
  SYD: ['sydney'],
  BNE: ['brisbane'],
  DXB: ['dubai'],
  LHR: ['london', 'london heathrow', 'heathrow'],
  ATH: ['athens'],
  KGS: ['kos island', 'kos'],
  CDG: ['paris'],
  ZUR: ['switzerland', 'zurich', 'zurich airport'],
  MAD: ['madrid'],
  GLA: ['glasgow'],
  EDI: ['edinburgh', 'edinbourough', 'edinboro'],
  SJO: ['san jose costa rica', 'san jose, costa rica'],
  DFW: ['dallas'],
  DEN: ['denver'],
  PHL: ['philadelphia'],
  VCE: ['venice'],
  SLA: ['salta'],
  PRG: ['prague'],
  CPH: ['copenhagen'],
  GRU: ['sao paulo', 'sao paolo', 'san paulo', 'san paolo', 'sampa'],
  LAD: ['luanda'],
  CLT: ['charlotte'],
  PMO: ['palermo'],
  CTA: ['catania'],
  FLR: ['florence'],
  FCO: ['rome'],
  DUB: ['dublin'],
};

function normalizeName(input: string): string {
  const lowered = input
    .toLowerCase()
    .replace(/[\u2019']/g, '')
    .replace(/[^a-z0-9,\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const [key, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lowered === word || lowered.includes(word)) {
        return key;
      }
    }
  }

  throw new Error(`Unable to resolve location: "${input}"`);
}

const rawRoutes: { year: number; routes: [string, string][] }[] = [
  {
    year: 2003,
    routes: [
      ['RDU', 'Miami'],
      ['Miami', 'EZE'],
      ['EZE', 'Miami'],
      ['Miami', 'RDU'],
    ],
  },
  {
    year: 2006,
    routes: [
      ['RDU', 'JFK'],
      ['JFK', 'EZE'],
      ['EZE', 'JFK'],
      ['JKF', 'RDU'],
    ],
  },
  {
    year: 2007,
    routes: [
      ['RDU', 'Boston'],
      ['Boston', 'RDU'],
    ],
  },
  {
    year: 2020,
    routes: [
      ['RDU', 'Seattle'],
      ['RDU', 'Atlanta'],
      ['Atlanta', 'EZE'],
    ],
  },
  {
    year: 2021,
    routes: [
      ['EZE', 'Iguana fall area (northern argentina)'],
      ['Iguana fall area (northern argentina)', 'EZE'],
      ['EZE', 'RDU'],
    ],
  },
  {
    year: 2022,
    routes: [
      ['RDU', 'Atlanta'],
      ['Atlanta', 'EZE'],
      ['Newbeery airport in Buenos Aires', 'airport in Calafate to see the Perito Moreno mountain'],
      ['Perito Moreno place', 'Newberry'],
      ['EZE', 'Atlanta'],
      ['Atlanta', 'RDU'],
      ['RDU', 'San Fransisco'],
      ['San Fransisco', 'Melbourne'],
      ['Melbourne', 'Adelaide'],
      ['Alice Springs', 'Sydney'],
      ['Brisbane', 'Dubai'],
      ['Dubai', 'London'],
      ['London', 'Athens'],
      ['Athens', 'Kos Island'],
      ['Kos Island', 'Athens'],
      ['Athens', 'Paris'],
      ['Switzerland', 'Madrid'],
      ['Madrid', 'Glasgow'],
      ['Edinbourough', 'RDU'],
    ],
  },
  {
    year: 2024,
    routes: [
      ['RDU', 'San Jose Costa Rica'],
      ['San Jose Costa Rica', 'RDU'],
      ['RDU', 'Dallas'],
      ['Dallas', 'RDU'],
      ['San Francisco', 'Denver'],
      ['Denver', 'JFK'],
      ['JFK', 'RDU'],
      ['RDU', 'Miami'],
      ['Mismo', 'EZE'],
      ['EZE', 'salta'],
      ['Salta', 'EZE'],
      ['EZE', 'Miami'],
      ['Miami', 'RDU'],
      ['RDU', 'Philadelphia'],
      ['Philadelphia', 'Venice'],
      ['Venice', 'Madrid'],
      ['Madrid', 'EZE'],
    ],
  },
  {
    year: 2026,
    routes: [
      ['EZE', 'Madrid'],
      ['Madrid', 'Venice'],
      ['Venice', 'Prague'],
      ['Prague', 'Venice'],
      ['Venice', 'Copenhagen'],
      ['Copenhagen', 'Venice'],
      ['Venice', 'jfk'],
      ['JFK', 'RDU'],
      ['RDU', 'Miami'],
      ['Miami', 'EZE'],
      ['EZE', 'San Paulo'],
      ['San Paulo', 'Luanda'],
      ['Luanda', 'San Paolo'],
      ['San Paulo', 'EZE'],
      ['EZE', 'Paris'],
      ['Paris', 'EZE'],
      ['EZE', 'Atlanta'],
      ['Atlanta', 'RDU'],
      ['RDU', 'Charlotte'],
      ['Charlotte', 'London Heathrow'],
      ['London Heathrow', 'Palermo'],
      ['Catania', 'Florence'],
      ['Rome', 'Dublin'],
      ['Dublin', 'RDU'],
    ],
  },
];

export const yearColors: Record<number, string> = {
  2003: '#60a5fa',
  2006: '#34d399',
  2007: '#facc15',
  2020: '#f87171',
  2021: '#c084fc',
  2022: '#22d3ee',
  2024: '#fb923c',
  2026: '#f472b6',
};

export const yearGroups: YearGroup[] = rawRoutes.map(({ year, routes }) => ({
  year,
  color: yearColors[year],
  flights: routes.map(([from, to]) => ({
    from: normalizeName(from),
    to: normalizeName(to),
    year,
  })),
}));

export const allFlights: Flight[] = yearGroups.flatMap((g) => g.flights);

export function getLocation(key: string): FlightLocation {
  const loc = locationMap.get(key);
  if (!loc) throw new Error(`Unknown location key: ${key}`);
  return loc;
}

export function getAllLocations(): FlightLocation[] {
  const keys = new Set<string>();
  allFlights.forEach((f) => {
    keys.add(f.from);
    keys.add(f.to);
  });
  return Array.from(keys)
    .map((k) => getLocation(k))
    .filter(Boolean);
}
