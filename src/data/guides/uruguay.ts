import { CountryGuideData } from './types';

export const uruguayGuide: CountryGuideData = {
  country: 'Uruguay',
  slug: 'uruguay',
  title: 'Uruguay',
  subtitle: 'Montevideo & the Maldonado coast',
  heroImage: '/img/Uruguay/uruguay_panorama (3).jpg',
  heroAlt: 'Uruguay panorama',
  mapContext: 'Uruguay',

  intro: [
    'Uruguay is South America’s laid-back secret — a capital with a 22 km waterfront rambla, the colonial jewel of Colonia, and the beach strip from Punta del Este to José Ignacio. My saved spot was inland Maldonado near Portezuelo, the ranch country behind the resort coast.',
    'Buses are the way to move — clean, frequent and cheap between Montevideo, Colonia and the Maldonado coast.',
  ],

  gettingThere: [
    {
      title: 'Ferry from Buenos Aires is the classic arrival',
      text: 'Buquebus and Colonia Express cross the Río de la Plata to Colonia (1h) or direct to Montevideo (~3h) — it’s how most people arrive.',
    },
    {
      title: 'Montevideo as the base',
      text: 'The Terminal Tres Cruces bus station connects everywhere — Punta del Este is 2h east, Colonia 2h west.',
    },
    {
      title: 'The coast needs a car (or patience)',
      text: 'José Ignacio, Portezuelo and the inland estancias are spread out — a rental car for a day or two unlocks the whole Maldonado coast.',
    },
  ],

  routes: [{
    title: 'Montevideo Old Town Walk',
    description:
      'Ciudad Vieja circuit — the port market, the old town squares, the Rambla waterfront and the Solis theatre.',
    stops: [
      { place: 'Mercado del Puerto' },
      { place: 'Plaza Independencia' },
      { place: 'Palacio Salvo' },
      { place: 'Teatro Solís' },
      { place: 'Rambla de Montevideo' },
      { place: 'Pocitos Beach' },
    ],
  }],

  categories: [
    { id: 'landmarks', label: 'Landmarks & History', icon: 'mdi:bank' },
    { id: 'outdoors', label: 'Outdoors & Views', icon: 'mdi:tree' },
    { id: 'food', label: 'Food & Drink', icon: 'mdi:silverware-fork-knife' },
    { id: 'misc', label: 'Misc', icon: 'mdi:dots-horizontal-circle-outline' },
  ],

  places: [
    {
      name: 'Colonia del Sacramento',
      category: 'landmarks',
      area: 'Colonia',
      description:
        'The UNESCO-listed Portuguese colonial quarter — cobbled lanes, a lighthouse over the Río de la Plata and 17th-century ramparts, an easy ferry day from BA.',
      featured: true,
      wikiTitle: 'Colonia del Sacramento',
      mapQuery: 'Colonia del Sacramento, Uruguay',
    },
    {
      name: 'Ciudad Vieja & Plaza Independencia',
      category: 'landmarks',
      area: 'Montevideo',
      description:
        'The walled old city — the last standing gate (Puerta de la Ciudadela), Plaza Independencia and the odd deco-gothic Palacio Salvo.',
      wikiTitle: 'Ciudad Vieja, Montevideo',
      mapQuery: 'Plaza Independencia, Montevideo',
    },
    {
      name: 'Teatro Solís',
      category: 'landmarks',
      area: 'Montevideo',
      description:
        'The 1856 neoclassical opera house — South America’s oldest great theatre, with guided tours through the gilded main hall.',
      wikiTitle: 'Solís Theatre',
      mapQuery: 'Teatro Solís, Montevideo',
    },
    {
      name: 'Punta del Este',
      category: 'outdoors',
      area: 'Maldonado',
      description:
        'The resort peninsula where the Río de la Plata meets the Atlantic — La Mano sculpture (Los Dedos) on Brava beach, marinas and summer crowds.',
      wikiTitle: 'Punta del Este',
      mapQuery: 'Punta del Este, Uruguay',
    },
    {
      name: 'José Ignacio',
      category: 'outdoors',
      area: 'Maldonado',
      description:
        'The fishing village turned chic beach hamlet 40 km up the coast — lighthouse, dune-backed beaches and world-famous La Huella restaurant.',
      tip: 'Sunset at the lighthouse point is the move.',
      mapQuery: 'José Ignacio, Uruguay',
    },
    {
      name: 'Portezuelo & the sierras',
      category: 'outdoors',
      area: 'Maldonado',
      description:
        'The rolling ranch country behind the coast — dirt roads between cattle estancias, eucalyptus hills and the quiet end of the coastal strip.',
      tip: 'My saved pin was out here — totally different Uruguay from the beach towns.',
      featured: true,
      mapQuery: 'Portezuelo, Maldonado, Uruguay',
    },
    {
      name: 'Rambla de Montevideo',
      category: 'outdoors',
      area: 'Montevideo',
      description:
        'The 22 km waterfront promenade — the world’s longest continuous sidewalk, lined with beaches, fishermen and mate-drinking locals at sunset.',
      featured: true,
      mapQuery: 'Rambla de Montevideo',
    },
    {
      name: 'Cabo Polonio',
      category: 'outdoors',
      area: 'Rocha',
      description:
        'The off-grid fishing hamlet on a shifting sand cape — no roads, no electricity grid, sea lions on the rocks. Reached by 4WD truck across the dunes.',
      mapQuery: 'Cabo Polonio, Uruguay',
    },
    {
      name: 'Mercado del Puerto',
      category: 'food',
      area: 'Montevideo',
      description:
        'The 1868 iron port market — a hall of parrilla grills where the lunch crowd eats steak at counters under the smoke.',
      tip: 'Sit at any parrilla counter and order the asado — the atmosphere is the point.',
      featured: true,
      mapQuery: 'Mercado del Puerto, Montevideo',
    },
    {
      name: 'Tannat wine country',
      category: 'food',
      area: 'Canelones / around Montevideo',
      description:
        'Uruguay’s signature grape — family bodegas 30 minutes from the city run tastings; Bouza and Pizzorno are the easiest to reach.',
      mapQuery: 'Bodega Bouza, Montevideo',
    },
    {
      name: 'Mate culture',
      category: 'misc',
      area: 'Everywhere',
      description:
        'The national ritual — half the population carries a thermos and gourd everywhere. You’ll be offered a sip; the etiquette is drink it all and hand it back.',
      mapQuery: 'Montevideo, Uruguay',
    },
  ],
};
