import { CountryGuideData } from './types';

export const czechRepublicGuide: CountryGuideData = {
  country: 'Czech Republic',
  slug: 'czech-republic',
  title: 'Czech Republic',
  subtitle: 'A Prague city guide',
  heroImage: '/img/Czech Republic/czech-republic-panorama (4).jpg',
  heroAlt: 'Prague panorama',
  mapContext: 'Prague, Czech Republic',

  intro: [
    'My Czech Republic photos are essentially a Prague trip — the capital is compact enough to cover on foot over two or three days, split between the Old Town on the right bank and the Castle district across the river.',
    'The tram network plus the funicular up Petřín cover the hills; everything in the historic center is best done on foot anyway.',
  ],

  gettingThere: [
    {
      title: 'Fly into PRG, bus + metro to center',
      text: 'Václav Havel Airport connects to the city by bus 119 to Nádraží Veleslavín (Metro A) — about 40 minutes total to the Old Town.',
    },
    {
      title: 'Stay in or near the Old Town',
      text: 'Staré Město and Malá Strana put every sight within walking distance; the cheaper hostels cluster around Náměstí Republiky.',
    },
    {
      title: 'Trams for the hills',
      text: 'Tram 22 climbs to Prague Castle and Petřín — the classic way to save your legs on the two big hills.',
    },
  ],

  routes: [{
    title: 'Prague Walking Route',
    description:
      'The classic one-day loop: Old Town in the morning, across Charles Bridge at midday light, up to the Castle and down through Petřín for sunset.',
    stops: [
      { place: 'Old Town Square, Prague' },
      { place: 'Prague Astronomical Clock' },
      { place: 'Charles Bridge' },
      { place: 'Prague Castle' },
      { place: 'St. Vitus Cathedral' },
      { place: 'Lennon Wall, Prague' },
      { place: 'Petřín Lookout Tower' },
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
      name: 'Charles Bridge',
      category: 'landmarks',
      area: 'Vltava river',
      description:
        'The 14th-century stone bridge lined with 30 baroque statues, linking the Old Town to Malá Strana since 1402.',
      tip: 'Cross at dawn — by midday it’s a wall of tourists.',
      featured: true,
      wikiTitle: 'Charles Bridge',
      mapQuery: 'Charles Bridge, Prague',
    },
    {
      name: 'Prague Castle & St. Vitus Cathedral',
      category: 'landmarks',
      area: 'Hradčany',
      description:
        'The largest ancient castle complex in the world — a hilltop of palaces and courtyards crowned by the Gothic cathedral where Czech kings were crowned.',
      featured: true,
      wikiTitle: 'Prague Castle',
      mapQuery: 'Prague Castle',
    },
    {
      name: 'Old Town Square & Astronomical Clock',
      category: 'landmarks',
      area: 'Staré Město',
      description:
        'The medieval market square watched over by the 1410 Orloj — the hourly show of rotating apostles draws a crowd on the hour.',
      wikiTitle: 'Old Town Square',
      mapQuery: 'Old Town Square, Prague',
    },
    {
      name: 'Strahov Monastery Library',
      category: 'landmarks',
      area: 'Hradčany',
      description:
        'Two baroque halls — the Theological and Philosophical — lined with 18th-century frescoes and 200,000 antique volumes.',
      mapQuery: 'Strahov Monastery, Prague',
    },
    {
      name: 'Lennon Wall',
      category: 'landmarks',
      area: 'Malá Strana',
      description:
        'A small wall covered in Lennon-inspired graffiti since the 1980s — a symbol of dissent under communism, repainted continuously ever since.',
      wikiTitle: 'Lennon Wall',
      mapQuery: 'Lennon Wall, Prague',
    },
    {
      name: 'Petřín Hill & Lookout Tower',
      category: 'outdoors',
      area: 'Malá Strana',
      description:
        'The forested hill above Malá Strana with a mini-Eiffel steel tower at the top — take the funicular up and walk down through the orchards.',
      tip: 'Sunset over the castle from the hill is the best free view in Prague.',
      wikiTitle: 'Petřín',
      mapQuery: 'Petřín Lookout Tower, Prague',
    },
    {
      name: 'Letná Park',
      category: 'outdoors',
      area: 'Holešovice',
      description:
        'The plateau park above the river where the giant Metronome stands — the classic skyline view over all the bridges at once.',
      mapQuery: 'Letná Park, Prague',
    },
    {
      name: 'Vltava river islands',
      category: 'outdoors',
      area: 'Center',
      description:
        'Střelecký and Slovanský islands — quiet green pockets mid-river with rowboat rentals and views back at the National Theatre.',
      mapQuery: 'Střelecký Island, Prague',
    },
    {
      name: 'Lokál',
      category: 'food',
      area: 'Dlouháá / multiple',
      description:
        'The benchmark Czech beer hall — fresh Pilsner tank beer and proper pub food like svíčková (beef in cream sauce) at long shared tables.',
      tip: 'Tank beer is noticeably fresher than standard Pilsner — order it.',
      mapQuery: 'Lokál Dlouháá, Prague',
    },
    {
      name: 'Kantýna',
      category: 'food',
      area: 'Wenceslas Square area',
      description:
        'A converted bank hall turned butcher-and-beer canteen — order cut meat by weight and beer by the half-liter at standing tables.',
      mapQuery: 'Kantýna, Prague',
    },
    {
      name: 'Eska',
      category: 'food',
      area: 'Karlín',
      description:
        'Michelin-noted modern Czech cooking in a former factory — the wood-fired bread and fermented-vegetable plates are the signature.',
      mapQuery: 'Eska, Prague',
    },
    {
      name: 'Beer spas',
      category: 'misc',
      area: 'Old Town',
      description:
        'A Prague novelty — wooden tubs filled with beer ingredients (hops, yeast) plus a tap beside you. Touristy but a fun winter evening.',
      mapQuery: 'Beer Spa Bernard, Prague',
    },
  ],
};
