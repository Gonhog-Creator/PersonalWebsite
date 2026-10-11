import { CountryGuideData } from './types';

export const finlandGuide: CountryGuideData = {
  country: 'Finland',
  slug: 'finland',
  title: 'Finland',
  subtitle: 'A Helsinki city guide',
  heroImage: '/img/Finland/finland-panorama (3).jpg',
  heroAlt: 'Helsinki panorama',
  mapContext: 'Helsinki, Finland',

  intro: [
    'My Finland photos center on Helsinki — a waterfront capital that mixes neoclassical Senate Square, design-district shops and a shoreline of islands reachable by ferry. It’s compact and flat, ideal for walking.',
    'The HSL tram network covers everything, and the Suomenlinna ferry runs from Market Square all day — it’s included in a normal transit ticket.',
  ],

  gettingThere: [
    {
      title: 'Fly into HEL, train to center',
      text: 'The I and P trains run from Helsinki Airport to the main station in about 30 minutes — the airport is well signed.',
    },
    {
      title: 'Stay around Kamppi or Kluuvi',
      text: 'The center is small — a hotel near the station puts Senate Square, the market and the ferries within a short walk.',
    },
    {
      title: 'HSL ticket covers trams and ferries',
      text: 'A single AB-zone ticket covers trams, metro, buses and the Suomenlinna ferry — buy the day pass if you plan more than two rides.',
    },
  ],

  routes: [{
    title: 'Helsinki Walking Route',
    description:
      'A one-day loop: design district in the morning, the market and cathedral at midday, ferry out to the Suomenlinna fortress for the afternoon.',
    stops: [
      { place: 'Esplanadi, Helsinki' },
      { place: 'Market Square, Helsinki' },
      { place: 'Helsinki Cathedral' },
      { place: 'Uspenski Cathedral' },
      { place: 'Suomenlinna ferry, Market Square' },
      { place: 'Suomenlinna fortress' },
      { place: 'Oodi Central Library' },
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
      name: 'Suomenlinna Fortress',
      category: 'landmarks',
      area: 'Island, 15 min ferry',
      description:
        'The 18th-century sea fortress spread over six islands — tunnels, bastions and a dry dock, UNESCO-listed since 1991. The ferry is part of the experience.',
      featured: true,
      wikiTitle: 'Suomenlinna',
      mapQuery: 'Suomenlinna, Helsinki',
    },
    {
      name: 'Helsinki Cathedral & Senate Square',
      category: 'landmarks',
      area: 'Kruununhaka',
      description:
        'The green-domed Lutheran cathedral (1852) above the neoclassical square designed by Carl Ludvig Engel — Helsinki’s defining image.',
      wikiTitle: 'Helsinki Cathedral',
      mapQuery: 'Helsinki Cathedral',
    },
    {
      name: 'Temppeliaukio Church (Rock Church)',
      category: 'landmarks',
      area: 'Töölö',
      description:
        'A circular church blasted directly into bedrock in 1969 — rough rock walls and a copper-wire dome, famous for its acoustics.',
      wikiTitle: 'Temppeliaukio Church',
      mapQuery: 'Temppeliaukio Church, Helsinki',
    },
    {
      name: 'Uspenski Cathedral',
      category: 'landmarks',
      area: 'Katajanokka',
      description:
        'The largest Orthodox church in Western Europe — red brick with gold onion domes on a hill overlooking the harbour.',
      wikiTitle: 'Uspenski Cathedral',
      mapQuery: 'Uspenski Cathedral, Helsinki',
    },
    {
      name: 'Ateneum Art Museum',
      category: 'landmarks',
      area: 'Kluuvi',
      description:
        'The national gallery across from the station — Finnish Golden Age painting (Gallen-Kallela, Simberg) in a Renaissance Revival palace.',
      wikiTitle: 'Ateneum',
      mapQuery: 'Ateneum, Helsinki',
    },
    {
      name: 'Market Square (Kauppatori)',
      category: 'outdoors',
      area: 'Harbour',
      description:
        'The harbourside market — salmon soup stalls, berry vendors and the quay where the Suomenlinna and zoo ferries depart.',
      tip: 'The salmon soup (lohikeitto) from the orange tents is the classic cheap lunch.',
      mapQuery: 'Market Square, Helsinki',
    },
    {
      name: 'Esplanadi & the Design District',
      category: 'outdoors',
      area: 'Center',
      description:
        'The tree-lined park promenade connecting the market to the Swedish Theatre, bordered by Marimekko, Iittala and the design district’s small shops.',
      wikiTitle: 'Esplanadi',
      mapQuery: 'Esplanadi, Helsinki',
    },
    {
      name: 'Nuuksio National Park',
      category: 'outdoors',
      area: 'Espoo, 45 min',
      description:
        'The nearest national park — lakes, bogs and old-growth forest a short bus ride from the city. Finnish everyman’s right means hiking anywhere.',
      mapQuery: 'Nuuksio National Park',
    },
    {
      name: 'Old Market Hall (Vanha Kauppahalli)',
      category: 'food',
      area: 'Harbour',
      description:
        'The 1889 indoor market beside the quay — fish counters, cheese, and Soppakeittiö’s salmon soup counter at the far end.',
      mapQuery: 'Old Market Hall, Helsinki',
    },
    {
      name: 'Sauna: Löyly or Kotiharjun',
      category: 'misc',
      area: 'Katajanokka / Kallio',
      description:
        'Sauna is non-negotiable in Finland. Löyly is the modern waterfront sauna with sea dips; Kotiharjun is the 1928 wood-fired working-class classic.',
      tip: 'Löyly lets you climb onto its wooden terraces right over the Baltic — book a time slot.',
      featured: true,
      mapQuery: 'Löyly sauna, Helsinki',
    },
    {
      name: 'Oodi Central Library',
      category: 'misc',
      area: 'Töölönlahti',
      description:
        'The 2018 “living room of the city” — a free public library with a wave-form third floor, 3D printers and a café with parliament views.',
      wikiTitle: 'Helsinki Central Library Oodi',
      mapQuery: 'Oodi Central Library, Helsinki',
    },
  ],
};
