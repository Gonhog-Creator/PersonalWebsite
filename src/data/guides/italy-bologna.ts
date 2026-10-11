import { CountryGuideData } from './types';

export const bolognaGuide: CountryGuideData = {
  country: 'Bologna',
  slug: 'italy/bologna',
  title: 'Bologna',
  subtitle: 'Porticoes, towers & Italy\'s food capital',
  heroImage: '/img/Italy/Bologna/bologna-panorama(1).jpg',
  heroAlt: 'Bologna panorama',
  mapContext: 'Bologna, Italy',

  intro: [
    'Bologna is the city Italians go to eat — the porticoed streets hide Italy\'s best pasta, the oldest university in the Western world, and a medieval center leaning on two famous towers.',
    'The center is a 25-minute walk end-to-end under continuous arcades — you can tour the whole city in the rain without an umbrella.',
  ],

  gettingThere: [
    {
      title: 'Train into Bologna Centrale',
      text: 'On the Milan–Florence–Rome high-speed line — the station is a 20-minute portico-covered walk or short bus to Piazza Maggiore.',
    },
    {
      title: 'Stay inside the ring road',
      text: 'The walls mark the historic center — anywhere inside puts everything on foot, and the university quarter is liveliest.',
    },
    {
      title: 'San Luca is a walk, not a climb',
      text: 'The basilica outside the walls is reached by the world\'s longest portico — 3.8 km and 666 arches from the city gate.',
    },
  ],

  routes: [{
    title: 'Bologna Walking Route',
    description:
      'Under the porticoes — Piazza Maggiore, the food market lanes, the two towers, and if you have legs left, the San Luca arcade pilgrimage.',
    stops: [
      { place: 'Piazza Maggiore, Bologna' },
      { place: 'Basilica di San Petronio' },
      { place: 'Quadrilatero market, Bologna' },
      { place: 'Two Towers, Bologna' },
      { place: 'University of Bologna' },
      { place: 'Finestrella di Via Piella' },
      { place: 'San Luca arcade' },
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
      name: 'Piazza Maggiore & San Petronio',
      category: 'landmarks',
      area: 'Center',
      description:
        'The city’s main square — the massive half-finished basilica (intended to outsize St Peter\'s), Neptune\'s fountain and medieval palaces all around.',
      featured: true,
      wikiTitle: 'Piazza Maggiore',
      mapQuery: 'Piazza Maggiore, Bologna',
    },
    {
      name: 'Two Towers (Asinelli & Garisenda)',
      category: 'landmarks',
      area: 'Center',
      description:
        'The leaning medieval towers that anchored a city of 180 towers — climb Asinelli\'s 498 steps for the red-roof panorama.',
      wikiTitle: 'Two Towers, Bologna',
      mapQuery: 'Asinelli Tower, Bologna',
    },
    {
      name: 'Archiginnasio & Teatro Anatomico',
      category: 'landmarks',
      area: 'University district',
      description:
        'The 16th-century university palace — frescoed coats of arms on every wall and the cedar anatomical theatre where dissections were performed.',
      wikiTitle: 'Archiginnasio of Bologna',
      mapQuery: 'Archiginnasio, Bologna',
    },
    {
      name: 'Basilica di Santo Stefano',
      category: 'landmarks',
      area: 'Santo Stefano',
      description:
        'The "Seven Churches" complex — a connected maze of early medieval chapels built over Roman and pagan remains.',
      wikiTitle: 'Santo Stefano, Bologna',
      mapQuery: 'Santo Stefano, Bologna',
    },
    {
      name: 'Porticoes of San Luca',
      category: 'outdoors',
      area: 'Southwest gate',
      description:
        'The 3.8 km uninterrupted arcade climbing to the Sanctuary of San Luca — a pilgrimage walk of 666 arches with city views at the top.',
      featured: true,
      wikiTitle: 'San Luca, Bologna',
      mapQuery: 'Santuario della Madonna di San Luca, Bologna',
    },
    {
      name: 'Finestrella — the canal window',
      category: 'outdoors',
      area: 'Via Piella',
      description:
        'A small window in a painted wall framing Bologna\'s hidden canal — the "Little Venice" moment in the middle of the city.',
      mapQuery: 'Finestrella di Via Piella, Bologna',
    },
    {
      name: 'Giardini Margherita',
      category: 'outdoors',
      area: 'South center',
      description:
        'The city park — a big lawn, ponds and the spot where students sprawl on summer evenings.',
      mapQuery: 'Giardini Margherita, Bologna',
    },
    {
      name: 'Quadrilatero food market',
      category: 'food',
      area: 'Off Piazza Maggiore',
      description:
        'The medieval market lanes — mortadella, Parmigiano wheels, fresh tortellini and the oldest osteria in town (Osteria del Sole, est. 1465).',
      tip: 'Bring your own food to Osteria del Sole — they sell only wine, the tables are communal.',
      featured: true,
      mapQuery: 'Quadrilatero, Bologna',
    },
    {
      name: 'Tagliatelle al ragù',
      category: 'food',
      area: 'Everywhere',
      description:
        'The real "bolognese" — silk-thick egg pasta with slow ragù, never spaghetti. Trattoria dell\'Orsa and Sfoglia Rina are student favorites.',
      featured: true,
      mapQuery: 'Sfoglia Rina, Bologna',
    },
    {
      name: 'Mortadella & tigelle',
      category: 'food',
      area: 'Everywhere',
      description:
        'The local sandwich stack — mortadella sliced to order with crescenta/tigelle flatbreads and squacquerone cheese.',
      mapQuery: 'Mo Mortadella Lab, Bologna',
    },
    {
      name: 'University quarter nightlife',
      category: 'misc',
      area: 'Via Zamboni',
      description:
        'The oldest university in the Western world (1088) means the whole district around Via Zamboni is bars, osterie and cheap aperitivo.',
      mapQuery: 'Via Zamboni, Bologna',
    },
    {
      name: 'Ferrari & Lamborghini day trips',
      category: 'misc',
      area: 'Modena / Sant\'Agata',
      description:
        'Motor Valley is 30 minutes away — the Enzo Ferrari museum in Modena and the Lamborghini factory museum in Sant\'Agata.',
      mapQuery: 'Museo Ferrari, Modena',
    },
  ],
};
