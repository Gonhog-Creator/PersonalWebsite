import { CountryGuideData } from './types';

export const austriaGuide: CountryGuideData = {
  country: 'Austria',
  slug: 'austria',
  title: 'Austria',
  subtitle: 'Vienna, Salzburg & Hallstatt',
  heroImage: '/img/Austria/austria_panorama (22).jpg',
  heroAlt: 'Austria panorama',
  mapContext: 'Austria',

  intro: [
    'Austria’s classic itinerary is the imperial triangle — Vienna’s palaces and coffee houses, Mozart’s Salzburg, and the lakeside villages of the Salzkammergut. The trains between them are fast and scenic.',
    'Vienna alone can fill three days; Salzburg and Hallstatt make perfect rail day-trips or a two-city extension.',
  ],

  gettingThere: [
    {
      title: 'Fly into Vienna (VIE)',
      text: 'The City Airport Train reaches the center in 16 minutes; the regular S7 S-Bahn is half the price and only slightly slower.',
    },
    {
      title: 'Salzburg is 2.5h by railjet',
      text: 'ÖBB Railjet trains run every 30–60 minutes from Vienna’s main station, continuing on to Munich.',
    },
    {
      title: 'Hallstatt: train + ferry',
      text: 'Salzburg → Hallstatt station is ~2h with a change at Attnang-Puchheim, then the ferry crosses the lake into the village — a great arrival.',
    },
  ],

  routes: [{
    title: 'Vienna Ring Walk',
    description:
      'The Ringstrasse circuit — opera house, Hofburg, the museum quarter, City Hall and a finish at St. Stephen’s Cathedral.',
    stops: [
      { place: 'Vienna State Opera' },
      { place: 'Hofburg Palace' },
      { place: 'Kunsthistorisches Museum' },
      { place: 'Rathaus, Vienna' },
      { place: 'Burgtheater' },
      { place: "St. Stephen's Cathedral, Vienna" },
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
      name: 'Schönbrunn Palace',
      category: 'landmarks',
      area: 'Vienna',
      description:
        'The Habsburg summer palace — 1,441 rooms of rococo excess, formal gardens and the Gloriette hilltop pavilion with the city’s best view.',
      featured: true,
      wikiTitle: 'Schönbrunn Palace',
      mapQuery: 'Schönbrunn Palace, Vienna',
    },
    {
      name: "St. Stephen's Cathedral",
      category: 'landmarks',
      area: 'Vienna',
      description:
        'The Gothic heart of the city since 1147 — patterned tile roof, 136 m south tower and catacombs beneath.',
      wikiTitle: "St. Stephen's Cathedral, Vienna",
      mapQuery: "St. Stephen's Cathedral, Vienna",
    },
    {
      name: 'Hofburg & the Ringstrasse',
      category: 'landmarks',
      area: 'Vienna',
      description:
        'The imperial palace complex at the center of the grand boulevard — the Opera, Parliament, City Hall and twin museums all on one ring.',
      wikiTitle: 'Hofburg',
      mapQuery: 'Hofburg Palace, Vienna',
    },
    {
      name: 'Belvedere Palace',
      category: 'landmarks',
      area: 'Vienna',
      description:
        'Two baroque palaces linked by gardens — the Upper Belvedere holds Klimt’s The Kiss and the national art collection.',
      wikiTitle: 'Belvedere, Vienna',
      mapQuery: 'Belvedere Palace, Vienna',
    },
    {
      name: 'Hohensalzburg Fortress',
      category: 'landmarks',
      area: 'Salzburg',
      description:
        'The white-walled fortress on the Festungsberg — one of Europe’s largest intact castles, reached by funicular above the old town.',
      wikiTitle: 'Hohensalzburg Fortress',
      mapQuery: 'Hohensalzburg Fortress, Salzburg',
    },
    {
      name: 'Mirabell Gardens',
      category: 'landmarks',
      area: 'Salzburg',
      description:
        'The baroque palace gardens where the Sound of Music "Do-Re-Mi" scene was filmed — Pegasus fountain, dwarf garden and fortress views.',
      wikiTitle: 'Mirabell Palace',
      mapQuery: 'Mirabell Gardens, Salzburg',
    },
    {
      name: 'Hallstatt',
      category: 'outdoors',
      area: 'Salzkammergut',
      description:
        'The lakeside village that became the postcard — pastel houses stacked between mountain and water, a salt mine and the famous ossuary.',
      tip: 'Arrive before 10am or stay overnight — the village empties out after the day-trippers leave.',
      featured: true,
      wikiTitle: 'Hallstatt',
      mapQuery: 'Hallstatt, Austria',
    },
    {
      name: 'Wolfgangsee',
      category: 'outdoors',
      area: 'Salzkammergut',
      description:
        'The bluest of the Salzkammergut lakes — the Schafbergbahn cog railway climbs 1,783 m from St. Wolfgang for views over seven lakes.',
      mapQuery: 'Schafbergbahn, St. Wolfgang',
    },
    {
      name: 'Prater & Riesenrad',
      category: 'outdoors',
      area: 'Vienna',
      description:
        'The giant park where Vienna plays — the 1897 ferris wheel (famous from The Third Man) plus meadows and the long Hauptallee for cycling.',
      wikiTitle: 'Prater',
      mapQuery: 'Riesenrad, Prater, Vienna',
    },
    {
      name: 'Naschmarkt',
      category: 'food',
      area: 'Vienna',
      description:
        'The city’s main food market — a 1.5 km strip of stalls, produce, spices and restaurants between two art nouveau pavilions.',
      mapQuery: 'Naschmarkt, Vienna',
    },
    {
      name: 'Viennese coffee houses',
      category: 'food',
      area: 'Vienna',
      description:
        'UNESCO-listed coffee-house culture — marble tables, newspapers on wooden racks and a melange coffee. Café Central and Sperl are the classics.',
      tip: 'One coffee buys you the table for the whole afternoon — bring a book.',
      featured: true,
      mapQuery: 'Café Central, Vienna',
    },
    {
      name: 'Schnitzel & sachertorte',
      category: 'food',
      area: 'Vienna',
      description:
        'Figlmüller serves the oversized veal-free original schnitzel; Hotel Sacher invented the chocolate-apricot sachertorte — both are institutions.',
      mapQuery: 'Figlmüller, Vienna',
    },
    {
      name: 'St. Gilgen & lake villages',
      category: 'misc',
      area: 'Salzkammergut',
      description:
        'The quieter alternative to Hallstatt — Mozart’s mother’s hometown on Wolfgangsee with ferries linking the lakeside villages.',
      mapQuery: 'St. Gilgen, Austria',
    },
  ],
};
