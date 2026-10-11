import { CountryGuideData } from './types';

export const veniceGuide: CountryGuideData = {
  country: 'Venice',
  slug: 'italy/venice',
  title: 'Venice',
  subtitle: 'A canal-city walking guide',
  heroImage: '/img/Italy/Venice/venice-panorama (1).jpg',
  heroAlt: 'Venice panorama',
  mapContext: 'Venice, Italy',

  intro: [
    'Venice is a maze on water — no cars, just lanes, bridges and vaporetto boats. My saved spot was on Murano, the glassmakers\' island, which pairs perfectly with a day wandering the quieter northern districts.',
    'The city rewards getting deliberately lost — the sights below are the anchors, but the best of Venice is in the unmarked lanes between them.',
  ],

  gettingThere: [
    {
      title: 'Arrive by train or ATVO bus',
      text: 'Santa Lucia station and Piazzale Roma both land you on the Grand Canal — the vaporetto (water bus) is the metro system from there.',
    },
    {
      title: 'Stay in Cannaregio or Dorsoduro',
      text: 'Both are quieter and cheaper than San Marco, and more local-feeling at night.',
    },
    {
      title: 'Vaporetto passes pay off fast',
      text: 'A 24h ACTV pass covers unlimited boats — essential for Murano, Burano and getting around without melting your feet.',
    },
  ],

  routes: [{
    title: 'Venice Walking Route',
    description:
      'The classic cross-city walk — station to San Marco via Rialto, drifting through Cannaregio on the way back. Add a Murano loop by boat.',
    stops: [
      { place: 'Rialto Bridge' },
      { place: 'Rialto Market, Venice' },
      { place: "St Mark's Basilica" },
      { place: "St Mark's Square" },
      { place: 'Doge\'s Palace' },
      { place: 'Bridge of Sighs' },
      { place: 'Accademia Bridge' },
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
      name: "St Mark's Square & Basilica",
      category: 'landmarks',
      area: 'San Marco',
      description:
        'Napoleon called it "the drawing room of Europe" — the gold-mosaic Byzantine basilica, the Campanile and the arcaded square at the city’s heart.',
      tip: 'Book the basilica online to skip the line — and go up the campanile for the lagoon panorama.',
      featured: true,
      wikiTitle: "St Mark's Basilica",
      mapQuery: "St Mark's Square, Venice",
    },
    {
      name: 'Doge\'s Palace',
      category: 'landmarks',
      area: 'San Marco',
      description:
        'The pink Gothic palace of the Venetian Republic — council chambers, Tintoretto’s massive Paradise canvas and the cells across the Bridge of Sighs.',
      wikiTitle: "Doge's Palace",
      mapQuery: "Doge's Palace, Venice",
    },
    {
      name: 'Rialto Bridge & Market',
      category: 'landmarks',
      area: 'San Polo',
      description:
        'The stone arch bridge over the Grand Canal and the 700-year-old fish and produce market at its foot — come before 1pm when the stalls close.',
      wikiTitle: 'Rialto Bridge',
      mapQuery: 'Rialto Bridge, Venice',
    },
    {
      name: 'Murano glassworks',
      category: 'landmarks',
      area: 'Murano island',
      description:
        'Glassmakers were moved here in 1291 to keep their furnaces off the main islands — factories along Fondamenta dei Vetrai run free glassblowing demos.',
      tip: 'My saved pin — skip the "showroom taxis" and take the vaporetto; demos along the fondamenta are free.',
      featured: true,
      mapQuery: 'Fondamenta dei Vetrai, Murano, Venice',
    },
    {
      name: 'Burano',
      category: 'outdoors',
      area: 'Burano island',
      description:
        'The rainbow-painted fishermen’s island 40 minutes by boat — candy-colored houses on tiny canals and a lace-making tradition.',
      wikiTitle: 'Burano',
      mapQuery: 'Burano, Venice',
    },
    {
      name: 'Cannaregio & the Ghetto',
      category: 'outdoors',
      area: 'Cannaregio',
      description:
        'The northern district — the world’s first Jewish ghetto (1516), quiet fondamente along the Misericordia canal and the city’s best bacaro bars.',
      mapQuery: 'Venetian Ghetto, Venice',
    },
    {
      name: 'Grand Canal by vaporetto',
      category: 'outdoors',
      area: 'Line 1',
      description:
        'Line 1 down the Grand Canal is the cheapest cruise in Italy — palazzo after palazzo from the station to San Marco. Ride it front-to-back once.',
      mapQuery: 'Vaporetto Line 1, Venice',
    },
    {
      name: 'Dorsoduro & Zattere',
      category: 'outdoors',
      area: 'Dorsoduro',
      description:
        'The artsy south side — the Accademia, the Peggy Guggenheim palazzo and the sunny Zattere promenade along the Giudecca Canal.',
      mapQuery: 'Zattere, Venice',
    },
    {
      name: 'Cicchetti & spritz (bacari)',
      category: 'food',
      area: 'Cannaregio / San Polo',
      description:
        'Venice’s tapas crawl — tiny stand-up bars (bacari) selling cicchetti bites and an Aperol spritz for a few euros. Cantina Do Mori is the oldest.',
      tip: 'An ombra (small glass) of local wine costs ~€1 — the original Venetian budget night out.',
      featured: true,
      mapQuery: 'Cantina Do Mori, Venice',
    },
    {
      name: 'Frittura & sarde in saor',
      category: 'food',
      area: 'Everywhere',
      description:
        'The lagoon flavors — fried seafood in paper cones (fritto misto) and sweet-sour marinated sardines, the classic Venetian antipasto.',
      mapQuery: 'Osteria al Squero, Venice',
    },
    {
      name: 'Squero San Trovaso',
      category: 'misc',
      area: 'Dorsoduro',
      description:
        'One of the last working gondola boatyards — the wooden shed across the Rio San Trovaso where gondolas are still built by hand.',
      mapQuery: 'Squero di San Trovaso, Venice',
    },
    {
      name: 'Gondola ride',
      category: 'misc',
      area: 'Everywhere',
      description:
        'Officially ~€90 for 30 minutes — pricey but iconic. Shared gondolas and traghetto ferries (€2 crossing) give the experience cheaper.',
      mapQuery: 'Gondola service, Venice',
    },
  ],
};
