import { CountryGuideData } from './types';

export const triesteGuide: CountryGuideData = {
  country: 'Trieste',
  slug: 'italy/trieste',
  title: 'Trieste',
  subtitle: 'Habsburg elegance on the Adriatic',
  heroImage: '/img/Italy/Trieste/trieste-panorama (1).jpg',
  heroAlt: 'Trieste panorama',
  mapContext: 'Trieste, Italy',

  intro: [
    'Trieste feels more Viennese than Italian — the former main port of the Austro-Hungarian Empire, all grand cafés, a vast sea-facing square, and the Bora wind that rips down the Adriatic.',
    'It\'s a compact city on a hillside — the center and seafront are walkable, and the castle and karst plateau above make a great half-day escape.',
  ],

  gettingThere: [
    {
      title: 'Train into Trieste Centrale',
      text: 'On the Venice–Ljubljana corridor — 2h from Venice, 1h40 from Ljubljana. The station opens straight onto the city.',
    },
    {
      title: 'Fly into TRS or take the ferry',
      text: 'The small airport is connected by rail; ferries and catamarans also link Trieste to Istria and the Croatian coast in summer.',
    },
    {
      title: 'The tram to Opicina climbs the karst',
      text: 'The historic tram-de-Opicina funicular climbs from the city to the karst plateau — the classic local ride with views back over the gulf.',
    },
  ],

  routes: [{
    title: 'Trieste Walking Route',
    description:
      'Seafront to hilltop — Piazza Unità, the Borgo Teresiano canal quarter, up through the old town to the castle and Roman theatre.',
    stops: [
      { place: 'Piazza Unità d\'Italia' },
      { place: 'Canal Grande, Trieste' },
      { place: 'Caffè Tommaseo' },
      { place: 'Teatro Romano, Trieste' },
      { place: 'Castello di San Giusto' },
      { place: 'Molo Audace pier' },
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
      name: 'Piazza Unità d\'Italia',
      category: 'landmarks',
      area: 'Seafront',
      description:
        'Europe\'s largest sea-facing square — Habsburg palaces on three sides, the open Adriatic on the fourth, the Caffè degli Specchi on the corner.',
      featured: true,
      wikiTitle: "Piazza Unità d'Italia",
      mapQuery: "Piazza Unità d'Italia, Trieste",
    },
    {
      name: 'Castello di San Giusto',
      category: 'landmarks',
      area: 'Hilltop',
      description:
        'The hilltop fortress and cathedral above the old town — ramparts, Roman ruins and the full panorama over the city and gulf.',
      mapQuery: 'Castello di San Giusto, Trieste',
    },
    {
      name: 'Canal Grande & Borgo Teresiano',
      category: 'landmarks',
      area: 'Center',
      description:
        'The canal district built for Maria Theresa\'s free port — neoclassical façades, the Serbian-Orthodox church and the bridge where Joyce had his bank.',
      mapQuery: 'Canal Grande, Trieste',
    },
    {
      name: 'Miramare Castle',
      category: 'landmarks',
      area: '8 km north',
      description:
        'Maximilian of Austria\'s white 1860s castle on the sea — turrets, a botanical park and the sad imperial history inside (he left to become emperor of Mexico).',
      wikiTitle: 'Miramare Castle',
      mapQuery: 'Miramare Castle, Trieste',
    },
    {
      name: 'Roman Theatre',
      category: 'landmarks',
      area: 'Old town',
      description:
        'The 1st-century AD theatre excavated at the foot of San Giusto hill — squeezed between medieval lanes at the heart of the old town.',
      mapQuery: 'Teatro Romano, Trieste',
    },
    {
      name: 'Grotta Gigante',
      category: 'outdoors',
      area: 'Karst plateau',
      description:
        'One of the world\'s largest show caves — a 107 m-high chamber in the karst above the city, reachable by a short bus ride.',
      wikiTitle: 'Grotta Gigante',
      mapQuery: 'Grotta Gigante, Trieste',
    },
    {
      name: 'Strada Napoleonica / Vicentina',
      category: 'outdoors',
      area: 'Opicina',
      description:
        'The cliff-side path on the karst edge — a flat 4 km promenade with uninterrupted views over the Gulf of Trieste.',
      tip: 'Take the Opicina tram up, walk the path, and bus back down — the best half-day in Trieste.',
      featured: true,
      mapQuery: 'Strada Napoleonica, Trieste',
    },
    {
      name: 'Barcola & the seafront',
      category: 'outdoors',
      area: 'North',
      description:
        'The concrete-and-pinewood seafront where Triestini swim — Miramare\'s silhouette in the distance and sunset over the gulf.',
      mapQuery: 'Barcola, Trieste',
    },
    {
      name: 'Historic cafés (Buffet/caffè)',
      category: 'food',
      area: 'Center',
      description:
        'The café culture is the draw — Caffè San Marco (Joyce\'s haunt), Tommaseo and the grand Caffè degli Specchi on the main square.',
      tip: 'Order a "capo in B" — the local macchiato in a small glass.',
      featured: true,
      mapQuery: 'Caffè San Marco, Trieste',
    },
    {
      name: 'Osmize & Carso food',
      category: 'food',
      area: 'Karst villages',
      description:
        'The farmhouse taverns on the plateau — private homes licensed to sell their own wine, prosciutto and boiled eggs. Look for a branch hung outside.',
      mapQuery: 'Osmiza, Trieste',
    },
    {
      name: 'Buffet da Pepi',
      category: 'food',
      area: 'Via Cassa di Risparmio',
      description:
        'The 1897 boiled-meat institution — the Austrian side of Triestine food: pork, sausage and sauerkraut with mustard and horseradish.',
      mapQuery: 'Buffet da Pepi, Trieste',
    },
    {
      name: 'James Joyce & literary heritage',
      category: 'misc',
      area: 'Center',
      description:
        'Joyce lived here 1904–1920 and wrote much of Ulysses — his statue stands on the Canal Grande bridge, and cafés mark his favorite tables.',
      wikiTitle: 'Trieste',
      mapQuery: 'James Joyce statue, Trieste',
    },
    {
      name: 'The Bora wind',
      category: 'misc',
      area: 'Everywhere',
      description:
        'The katabatic wind that blasts down the karst at 130+ km/h — there are chains to hold on the seafront for a reason. If it\'s blowing, respect it.',
      mapQuery: 'Trieste, Italy',
    },
  ],
};
