import { CountryGuideData } from './types';

export const belgiumGuide: CountryGuideData = {
  country: 'Belgium',
  slug: 'belgium',
  title: 'Belgium',
  subtitle: 'Bruges, Ghent & Brussels',
  heroImage: '/img/Belgium/belgium_panorama (4).jpg',
  heroAlt: 'Belgium panorama',
  mapContext: 'Belgium',

  intro: [
    'Belgium is compact — Bruges, Ghent and Brussels are all within an hour of each other by train, which makes it easy to base in one city and day-trip the others. Bruges was the highlight for me; it’s small enough to see on foot in a day.',
    'The whole country runs on trains. Buy a single ticket between any two stations and hop on — no reservations needed on domestic services.',
  ],

  gettingThere: [
    {
      title: 'Base yourself in Bruges or Ghent',
      text: 'Bruges is the postcard city but quiet at night; Ghent is livelier and cheaper. Brussels has the best rail links if you’re moving around a lot.',
    },
    {
      title: 'Trains between cities',
      text: 'Brussels–Bruges is about an hour direct; Ghent is the halfway stop, so you can visit both from either base.',
    },
    {
      title: 'Walk, don’t drive',
      text: 'Bruges center is pedestrianized and tiny — the entire walking route below fits in an afternoon.',
    },
  ],

  routes: [{
    title: 'Bruges Walking Route',
    description:
      'A loop through the medieval center — start at the Markt, drift through the Beguinage quarter, and finish along the canals near Rozenhoedkaai.',
    stops: [
      { place: 'Markt, Bruges' },
      { place: 'Belfry of Bruges' },
      { place: 'Burg Square, Bruges' },
      { place: 'Rozenhoedkaai' },
      { place: 'Church of Our Lady, Bruges' },
      { place: 'Begijnhof, Bruges' },
      { place: 'Minnewater Park' },
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
      name: 'Beguinage (Begijnhof)',
      category: 'landmarks',
      area: 'Bruges',
      description:
        'A quiet walled courtyard founded in 1245 for lay religious women — white houses around a lawn of daffodils, still home to Benedictine nuns.',
      tip: 'My saved pin was on this corner of the city — the calmest spot in Bruges.',
      featured: true,
      wikiTitle: 'Ten Wijngaerde',
      mapQuery: 'Grauwwerkersstraat, Bruges',
    },
    {
      name: 'Belfry of Bruges',
      category: 'landmarks',
      area: 'Bruges',
      description:
        'The 83 m medieval bell tower on the Markt — climb 366 steps for the classic view over the stepped-gable rooftops.',
      wikiTitle: 'Belfry of Bruges',
      mapQuery: 'Belfry of Bruges',
    },
    {
      name: 'Markt & Burg Square',
      category: 'landmarks',
      area: 'Bruges',
      description:
        'The twin hearts of the old town — the guild-hall-lined market square and the Burg with the Gothic City Hall and the Basilica of the Holy Blood.',
      wikiTitle: 'Markt (Bruges)',
      mapQuery: 'Markt, Bruges',
    },
    {
      name: 'Gravensteen',
      category: 'landmarks',
      area: 'Ghent',
      description:
        'The “Castle of the Counts” — a moated 12th-century fortress in the middle of Ghent with a keep you can climb.',
      wikiTitle: 'Gravensteen',
      mapQuery: 'Gravensteen, Ghent',
    },
    {
      name: 'Graslei & Korenlei',
      category: 'landmarks',
      area: 'Ghent',
      description:
        'The twin quays on the Leie river, lined with medieval guild houses — Ghent’s postcard view, best from St Michael’s Bridge.',
      mapQuery: 'Graslei, Ghent',
    },
    {
      name: 'Grand Place',
      category: 'landmarks',
      area: 'Brussels',
      description:
        'Brussels’ gilded central square — opulent 17th-century guild halls around the Gothic Town Hall, UNESCO-listed since 1998.',
      wikiTitle: 'Grand Place',
      mapQuery: 'Grand Place, Brussels',
    },
    {
      name: 'Atomium',
      category: 'landmarks',
      area: 'Brussels',
      description:
        'The 102 m steel atom built for Expo 58 — spheres connected by escalator tubes with a panorama deck at the top.',
      wikiTitle: 'Atomium',
      mapQuery: 'Atomium, Brussels',
    },
    {
      name: 'Church of Our Lady',
      category: 'landmarks',
      area: 'Bruges',
      description:
        'Houses Michelangelo’s Madonna and Child — the only one of his sculptures to leave Italy during his lifetime.',
      wikiTitle: 'Church of Our Lady, Bruges',
      mapQuery: 'Church of Our Lady, Bruges',
    },
    {
      name: 'Minnewater (Lake of Love)',
      category: 'outdoors',
      area: 'Bruges',
      description:
        'The small lake and park at the southern edge of the old town where the canals begin — swans, bridges and weeping willows.',
      mapQuery: 'Minnewater, Bruges',
    },
    {
      name: 'De Halve Maan Brewery',
      category: 'food',
      area: 'Bruges',
      description:
        'The last working brewery inside Bruges’ old town, running since 1856 — tours end on the rooftop with a Brugse Zot tasting.',
      tip: 'Look for the beer pipeline — they built a 3 km pipe to the bottling plant outside the city.',
      mapQuery: 'De Halve Maan, Bruges',
    },
    {
      name: 'Canal boat tour',
      category: 'outdoors',
      area: 'Bruges',
      description:
        'The classic 30-minute boat loop through Bruges’ canals — the easiest way to see the bridges and waterside facades.',
      mapQuery: 'Bruges canal boat tour, Rozenhoedkaai',
    },
    {
      name: 'Belgian fries & waffles',
      category: 'food',
      area: 'Everywhere',
      description:
        'Frietkotten (fry shacks) serve double-fried frites with mayo; Liège waffles are the dense, caramelized variety — look for them hot from the iron.',
      mapQuery: 'Frietmuseum, Bruges',
    },
  ],
};
