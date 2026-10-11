import { CountryGuideData } from './types';

export const sloveniaGuide: CountryGuideData = {
  country: 'Slovenia',
  slug: 'slovenia',
  title: 'Slovenia',
  subtitle: 'Ljubljana & Lake Bled',
  heroImage: '/img/Slovenia/slovenia_panorama (8).jpg',
  heroAlt: 'Slovenia panorama',
  mapContext: 'Slovenia',

  intro: [
    'Slovenia punches far above its size — a capital city with a car-free old town and a castle on a hill, plus Lake Bled and the Alps an hour away. It’s one of Europe’s easiest countries to do well in a few days.',
    'Ljubljana is the natural base — Bled, Postojna Cave and even the coast are all reachable as day trips on public transport.',
  ],

  gettingThere: [
    {
      title: 'Fly into Ljubljana (LJU)',
      text: 'The airport is 25 minutes north of the center — shuttle buses to the main station run on the hour.',
    },
    {
      title: 'Bled is an hour by bus',
      text: 'Buses from Ljubljana’s main station run roughly hourly — the lake walk from Bled town to the castle viewpoint is the classic circuit.',
    },
    {
      title: 'Ljubljana center is car-free',
      text: 'Everything in the old town is walking distance; the funicular and tourist trains go up to the castle if you want to save the climb.',
    },
  ],

  routes: [{
    title: 'Ljubljana Walking Route',
    description:
      'The riverside old town loop — Triple Bridge and Prešeren Square, along the Ljubljanica embankments, up to the castle, and back past the market colonnade.',
    stops: [
      { place: 'Prešeren Square, Ljubljana' },
      { place: 'Triple Bridge' },
      { place: 'Central Market, Ljubljana' },
      { place: 'Dragon Bridge' },
      { place: 'Ljubljana Castle' },
      { place: 'Tivoli Park' },
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
      name: 'Ljubljana Castle',
      category: 'landmarks',
      area: 'Castle Hill',
      description:
        'The hilltop fortress above the old town — medieval keep, a small museum and the classic panorama over the red rooftops to the Alps.',
      wikiTitle: 'Ljubljana Castle',
      mapQuery: 'Ljubljana Castle',
    },
    {
      name: 'Triple Bridge & Prešeren Square',
      category: 'landmarks',
      area: 'Center',
      description:
        'Jože Plečnik’s triple-arched bridge (1932) fronting the pink Franciscan church — the living room of the city where everyone meets.',
      featured: true,
      wikiTitle: 'Triple Bridge',
      mapQuery: 'Triple Bridge, Ljubljana',
    },
    {
      name: 'Dragon Bridge',
      category: 'landmarks',
      area: 'Center',
      description:
        'The 1907 Art Nouveau bridge guarded by four copper dragons — the city’s symbol and one of Europe’s first reinforced-concrete bridges.',
      wikiTitle: 'Dragon Bridge (Ljubljana)',
      mapQuery: 'Dragon Bridge, Ljubljana',
    },
    {
      name: 'Cathedral of St. Nicholas',
      category: 'landmarks',
      area: 'Old Town',
      description:
        'The baroque cathedral with bronze doors depicting Slovene history — a dome and frescoes above the market colonnade.',
      mapQuery: 'Ljubljana Cathedral',
    },
    {
      name: 'Lake Bled',
      category: 'outdoors',
      area: 'Upper Carniola',
      description:
        'The glacial lake with a tiny island church and a castle on the cliff — walk the 6 km perimeter, row to the island or climb the Ojstrica viewpoint.',
      tip: 'Hike up Ojstrica for the postcard view of the island — much better than the castle terrace and it’s free.',
      featured: true,
      wikiTitle: 'Lake Bled',
      mapQuery: 'Lake Bled, Slovenia',
    },
    {
      name: 'Vintgar Gorge',
      category: 'outdoors',
      area: 'Bled',
      description:
        'A 1.6 km boardwalk through a narrow river gorge ending at the Šum waterfall — a 30-minute shuttle from Bled town.',
      mapQuery: 'Vintgar Gorge, Slovenia',
    },
    {
      name: 'Lake Bohinj',
      category: 'outdoors',
      area: 'Triglav NP',
      description:
        'The quieter, larger glacial lake inside Triglav National Park — swim in summer, take the Vogel cable car up for the high-alpine view.',
      mapQuery: 'Lake Bohinj, Slovenia',
    },
    {
      name: 'Postojna Cave',
      category: 'outdoors',
      area: 'Postojna',
      description:
        'The 24 km cave system toured partly by electric train — karst formations and the endemic olm ("human fish") salamander.',
      wikiTitle: 'Postojna Cave',
      mapQuery: 'Postojna Cave, Slovenia',
    },
    {
      name: 'Central Market & riverside',
      category: 'food',
      area: 'Vodnik Square',
      description:
        'Plečnik’s riverside colonnade market — produce, pumpkin seed oil and štruklji (rolled dumplings) from the surrounding stands.',
      mapQuery: 'Central Market, Ljubljana',
    },
    {
      name: 'Odprta kuhna (Open Kitchen)',
      category: 'food',
      area: 'Pogačar Square',
      description:
        'The Friday food market where Slovenian restaurants set up stalls outdoors — run spring through autumn, hugely popular with locals.',
      tip: 'If you’re in town on a Friday, this is the lunch.',
      mapQuery: 'Odprta kuhna, Ljubljana',
    },
    {
      name: 'Kremna rezina (Bled cream cake)',
      category: 'food',
      area: 'Bled',
      description:
        'The town’s signature dessert — vanilla custard and cream between puff pastry layers, served as a perfect cube since 1953 at the Park Hotel café.',
      mapQuery: 'Hotel Park Bled café',
    },
  ],
};
