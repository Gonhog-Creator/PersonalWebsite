import { CountryGuideData } from './types';

export const costaRicaGuide: CountryGuideData = {
  country: 'Costa Rica',
  slug: 'costa-rica',
  title: 'Costa Rica',
  subtitle: 'Pacific coast, volcanoes & cloud forest',
  heroImage: '/img/Costa Rica/panorama-costarica (17).jpg',
  heroAlt: 'Costa Rica panorama',
  mapContext: 'Costa Rica',

  intro: [
    'Costa Rica is a nature trip first and a city trip never — the draw is national parks, volcanoes and beaches. My time was on the central Pacific coast around Quepos and Manuel Antonio, plus the interior highlands.',
    'A rental 4WD opens the country up — distances look short on the map but mountain roads are slow. Public "directo" buses cover the main routes cheaply if you’re patient.',
  ],

  gettingThere: [
    {
      title: 'Fly into San José (SJO)',
      text: 'SJO sits in the Central Valley — most people overnight near the airport and head straight to the coast or Arenal the next morning.',
    },
    {
      title: 'Manuel Antonio is 3h by road',
      text: 'The coastal highway via Jacó is paved and scenic; Quepos is the gateway town with buses shuttling to the park entrance.',
    },
    {
      title: 'Arenal/La Fortuna is the volcano base',
      text: 'About 3 hours northwest of San José — shuttle vans between La Fortuna, Monteverde and Manuel Antonio are the backpacker standard.',
    },
  ],

  routes: [{
    title: '',
    description: '',
    stops: [],
  }],

  categories: [
    { id: 'landmarks', label: 'Landmarks & History', icon: 'mdi:bank' },
    { id: 'outdoors', label: 'Outdoors & Views', icon: 'mdi:tree' },
    { id: 'food', label: 'Food & Drink', icon: 'mdi:silverware-fork-knife' },
    { id: 'misc', label: 'Misc', icon: 'mdi:dots-horizontal-circle-outline' },
  ],

  places: [
    {
      name: 'Manuel Antonio National Park',
      category: 'outdoors',
      area: 'Quepos, Puntarenas',
      description:
        'The country’s most-visited park — rainforest trails ending on white-sand beaches, with sloths, capuchins and scarlet macaws along the flat main path.',
      tip: 'Arrive at opening to see wildlife before the heat and crowds; bring swimwear for the park beach.',
      featured: true,
      wikiTitle: 'Manuel Antonio National Park',
      mapQuery: 'Manuel Antonio National Park',
    },
    {
      name: 'Playa Guapil & the Aguirre coast',
      category: 'outdoors',
      area: 'Parrita, Puntarenas',
      description:
        'The quiet string of Pacific beaches north of Quepos — estuary birdwatching, empty sand and the Palo Seco mangroves.',
      tip: 'My saved pin on this stretch — far quieter than Manuel Antonio.',
      featured: true,
      mapQuery: 'Calle Playa Guapil, Aguirre, Costa Rica',
    },
    {
      name: 'Arenal Volcano',
      category: 'outdoors',
      area: 'La Fortuna, Alajuela',
      description:
        'The near-perfect volcanic cone that was active until 2010 — lava fields, a lake at its base and trails through regenerating forest.',
      wikiTitle: 'Arenal Volcano',
      mapQuery: 'Arenal Volcano National Park',
    },
    {
      name: 'Mistico Hanging Bridges',
      category: 'outdoors',
      area: 'La Fortuna',
      description:
        'A 3 km trail crossing sixteen suspension bridges through the rainforest canopy with the volcano as a backdrop.',
      tip: 'Go in the morning mist — the canopy feels completely different than at midday.',
      mapQuery: 'Mistico Arenal Hanging Bridges Park',
    },
    {
      name: 'Monteverde Cloud Forest',
      category: 'outdoors',
      area: 'Puntarenas',
      description:
        'The famous misty highland reserve protecting quetzals, orchids and the continental divide — walk it on a guided morning tour for the best sightings.',
      wikiTitle: 'Monteverde Cloud Forest Reserve',
      mapQuery: 'Monteverde Cloud Forest Reserve',
    },
    {
      name: 'La Fortuna Waterfall',
      category: 'outdoors',
      area: 'La Fortuna',
      description:
        'A 70 m waterfall dropping into a jade pool at the forest edge — 500 steps down and the same back up.',
      mapQuery: 'La Fortuna Waterfall',
    },
    {
      name: 'Hot springs',
      category: 'outdoors',
      area: 'La Fortuna',
      description:
        'Arenal heats a whole valley of thermal rivers — from free access points at Río Chollín to resort pools like Tabacón and Baldi.',
      mapQuery: 'Río Chollín hot springs, La Fortuna',
    },
    {
      name: 'Sodas & casados',
      category: 'food',
      area: 'Everywhere',
      description:
        'Family-run diners called sodas serve the national plate — casado: rice, beans, plantains, salad and a protein for a few dollars.',
      mapQuery: 'Soda Víquez, San José',
    },
    {
      name: 'Coffee & chocolate tours',
      category: 'misc',
      area: 'Central Valley / La Fortuna',
      description:
        'Working plantations around the Central Valley and La Fortuna run tours from bean to cup — the Don Juan and Café Britt tours are the classics.',
      mapQuery: 'Café Britt coffee tour, Heredia',
    },
    {
      name: 'San José',
      category: 'landmarks',
      area: 'Capital',
      description:
        'The capital is mostly a transit stop, but the Mercado Central, Teatro Nacional and Barrio Escalante restaurants justify half a day.',
      mapQuery: 'Teatro Nacional de Costa Rica, San José',
    },
  ],
};
