import { CountryGuideData } from './types';

export const swedenGuide: CountryGuideData = {
  country: 'Sweden',
  slug: 'sweden',
  title: 'Sweden',
  subtitle: 'Stockholm & the archipelago',
  heroImage: '/img/Sweden/sweden-panorama (1).jpg',
  heroAlt: 'Stockholm panorama',
  mapContext: 'Stockholm, Sweden',

  intro: [
    'Stockholm is a city built on 14 islands — the old town Gamla Stan on one, museums on Djurgården, nightlife on Södermalm. A ferries-included transit pass turns the water into part of the commute.',
    'The city is walkable but spread across islands — the SL access card covers metros, buses and the harbor ferries (worth it just for the boat rides).',
  ],

  gettingThere: [
    {
      title: 'Arlanda Express to center',
      text: 'The express train reaches Stockholm Central in 18 minutes; the cheaper Flygbussarna coach takes about 45.',
    },
    {
      title: 'Stay on Södermalm or near Gamla Stan',
      text: 'Söder is the local-feeling district with bars and views; Norrmalm/City is the practical choice for station access.',
    },
    {
      title: 'SL card covers ferries',
      text: 'The same transit pass works on the Djurgården and Nybroviken ferries — island-hopping is just public transport.',
    },
  ],

  routes: [{
    title: 'Stockholm Walking Route',
    description:
      'A day across the islands — Gamla Stan lanes and palace in the morning, ferry to Djurgården for the Vasa, finish in Södermalm for the viewpoint.',
    stops: [
      { place: 'Gamla Stan' },
      { place: 'Royal Palace, Stockholm' },
      { place: 'Stortorget, Stockholm' },
      { place: 'Nobel Prize Museum' },
      { place: 'Vasa Museum' },
      { place: 'Skansen' },
      { place: 'Monteliusvägen viewpoint' },
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
      name: 'Vasa Museum',
      category: 'landmarks',
      area: 'Djurgården',
      description:
        'The warship that sank 400 m into its 1628 maiden voyage, recovered nearly intact — a full 17th-century ship inside a purpose-built hall.',
      tip: 'Sweden’s most-visited museum for a reason — the ship is overwhelming in person.',
      featured: true,
      wikiTitle: 'Vasa (ship)',
      mapQuery: 'Vasa Museum, Stockholm',
    },
    {
      name: 'Gamla Stan',
      category: 'landmarks',
      area: 'Old Town island',
      description:
        'The medieval old town on its own island — cobbled lanes, the Royal Palace, Stortorget’s colored merchant houses and Storkyrkan cathedral.',
      featured: true,
      wikiTitle: 'Gamla stan',
      mapQuery: 'Gamla Stan, Stockholm',
    },
    {
      name: 'Royal Palace',
      category: 'landmarks',
      area: 'Gamla Stan',
      description:
        'One of Europe’s largest palaces — 600 rooms, the Treasury, the Armory and the daily changing of the guard in the courtyard.',
      wikiTitle: 'Stockholm Palace',
      mapQuery: 'Royal Palace, Stockholm',
    },
    {
      name: 'Fotografiska',
      category: 'landmarks',
      area: 'Södermalm',
      description:
        'The contemporary photography museum in a converted customs house on the harbor — rotating exhibitions plus a top-floor café with views.',
      mapQuery: 'Fotografiska, Stockholm',
    },
    {
      name: 'Stockholm archipelago',
      category: 'outdoors',
      area: 'East of the city',
      description:
        '30,000 islands of bare granite and pine — ferries run all the way to Sandhamn; Vaxholm is the classic easy half-day trip.',
      tip: 'Any Waxholmsbolaget ferry counts — even riding to Vaxholm and back is the experience.',
      featured: true,
      wikiTitle: 'Stockholm archipelago',
      mapQuery: 'Vaxholm, Sweden',
    },
    {
      name: 'Monteliusvägen',
      category: 'outdoors',
      area: 'Södermalm',
      description:
        'The 500 m cliff-path viewpoint on Söder — the postcard view across the water to City Hall and Gamla Stan, best at sunset.',
      mapQuery: 'Monteliusvägen, Stockholm',
    },
    {
      name: 'Djurgården island',
      category: 'outdoors',
      area: 'East center',
      description:
        'The green museum island — Vasa, Skansen open-air museum and ABBA museum all on one leafy island reached by ferry or tram.',
      mapQuery: 'Djurgården, Stockholm',
    },
    {
      name: 'Östermalms Saluhall',
      category: 'food',
      area: 'Östermalm',
      description:
        'The 1888 food hall — seafood counters, cured elk and gravlax, and the famous Lisa Elmqvist restaurant in the middle.',
      mapQuery: 'Östermalms Saluhall, Stockholm',
    },
    {
      name: 'Fika — kanelbulle & coffee',
      category: 'food',
      area: 'Everywhere',
      description:
        'The institution — a cinnamon bun and coffee pause that Swedes take seriously. Vetekatten or Fabrique are the classic bakeries.',
      tip: 'The cardamom bun (kardemummabulle) beats the cinnamon one — order both and compare.',
      featured: true,
      mapQuery: 'Vete-Katten, Stockholm',
    },
    {
      name: 'Skansen',
      category: 'misc',
      area: 'Djurgården',
      description:
        'The world’s oldest open-air museum (1891) — relocated farmsteads and workshops plus a Nordic animal park with moose and bears.',
      wikiTitle: 'Skansen',
      mapQuery: 'Skansen, Stockholm',
    },
    {
      name: 'Metro art stations',
      category: 'misc',
      area: 'Underground',
      description:
        'The "world’s longest art gallery" — 90+ stations decorated with bedrock murals; T-Centralen, Solna Centrum and Stadion are the standouts.',
      mapQuery: 'T-Centralen metro station, Stockholm',
    },
  ],
};
