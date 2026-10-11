import { CountryGuideData } from './types';

export const switzerlandGuide: CountryGuideData = {
  country: 'Switzerland',
  slug: 'switzerland',
  title: 'Switzerland',
  subtitle: 'Lucerne, the Alps & Zürich',
  heroImage: '/img/Switzerland/switzerland_panorama (16).jpg',
  heroAlt: 'Switzerland panorama',
  mapContext: 'Switzerland',

  intro: [
    'Switzerland is built for sightseeing by train — the rails go over passes, around lakes and up mountainsides. Zürich is the practical entry; Lucerne and the Bernese Oberland are the postcard.',
    'The Swiss Travel Pass covers trains, boats and many mountain lifts — do the math, but for a multi-day trip it usually pays for itself.',
  ],

  gettingThere: [
    {
      title: 'Fly into Zürich (ZRH)',
      text: 'The airport has its own train station — 10 minutes to the main station, direct connections onward to Lucerne and Interlaken.',
    },
    {
      title: 'Lucerne as the mountain base',
      text: 'An hour from Zürich by train — boats to Pilatus and Rigi leave from the dock right outside the station.',
    },
    {
      title: 'GoldenPass for the scenic route',
      text: 'The panoramic train from Lucerne to Interlaken through the Brünig Pass is the classic way to reach the Bernese Oberland.',
    },
  ],

  routes: [{
    title: 'Lucerne Walking Route',
    description:
      'The old-town circuit — Chapel Bridge, the lakeside promenade, the Lion Monument and the medieval wall towers.',
    stops: [
      { place: 'Chapel Bridge, Lucerne' },
      { place: 'Spreuer Bridge, Lucerne' },
      { place: 'Old Town, Lucerne' },
      { place: 'Lion Monument' },
      { place: 'Musegg Wall, Lucerne' },
      { place: 'Lake Lucerne promenade' },
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
      name: 'Chapel Bridge (Kapellbrücke)',
      category: 'landmarks',
      area: 'Lucerne',
      description:
        'The 1333 covered wooden bridge — the oldest in Europe, crossing the Reuss with painted panels and the stone Water Tower.',
      featured: true,
      wikiTitle: 'Kapellbrücke',
      mapQuery: 'Chapel Bridge, Lucerne',
    },
    {
      name: 'Lion Monument',
      category: 'landmarks',
      area: 'Lucerne',
      description:
        'The dying lion carved into sandstone in 1821 — a memorial to the Swiss Guards killed during the French Revolution; Mark Twain called it the most mournful stone in the world.',
      wikiTitle: 'Lion Monument',
      mapQuery: 'Lion Monument, Lucerne',
    },
    {
      name: 'Grossmünster',
      category: 'landmarks',
      area: 'Zürich',
      description:
        'The twin-towered Romanesque church where the Swiss Reformation began — climb the Karlsturm for the view over the old town and lake.',
      wikiTitle: 'Grossmünster',
      mapQuery: 'Grossmünster, Zürich',
    },
    {
      name: 'Mount Pilatus',
      category: 'outdoors',
      area: 'Lucerne',
      description:
        'The 2,128 m peak above Lucerne — ascend by the world’s steepest cogwheel railway or cable car for the Alpine panorama.',
      tip: 'Do the "Golden Round Trip": boat, cogwheel up, cable car down, bus back.',
      featured: true,
      wikiTitle: 'Pilatus',
      mapQuery: 'Mount Pilatus, Switzerland',
    },
    {
      name: 'Jungfraujoch — Top of Europe',
      category: 'outdoors',
      area: 'Bernese Oberland',
      description:
        'Europe’s highest railway station at 3,454 m — the train tunnels through the Eiger to a glacier plateau between Mönch and Jungfrau.',
      wikiTitle: 'Jungfraujoch',
      mapQuery: 'Jungfraujoch, Switzerland',
    },
    {
      name: 'Lauterbrunnen Valley',
      category: 'outdoors',
      area: 'Bernese Oberland',
      description:
        'The glacial valley of 72 waterfalls — Staubbach Falls drops 300 m beside the village; Mürren and Wengen hang on the cliffs above.',
      mapQuery: 'Lauterbrunnen, Switzerland',
    },
    {
      name: 'Lake Lucerne boat cruise',
      category: 'outdoors',
      area: 'Lucerne',
      description:
        'The fjord-like lake ringed by mountains — historic paddle steamers connect Lucerne to the mountain bases at Vitznau and Alpnachstad.',
      mapQuery: 'Lake Lucerne boat cruise',
    },
    {
      name: 'Lake Zürich promenade',
      category: 'outdoors',
      area: 'Zürich',
      description:
        'The lakeside path from Bürkliplatz — swimming spots, Badi lake baths in summer and views across to the Alps on clear days.',
      mapQuery: 'Lake Zürich promenade',
    },
    {
      name: 'Fondue & raclette',
      category: 'food',
      area: 'Everywhere',
      description:
        'The two national dishes — bubbling pots of melted cheese with bread (fondue) or scraped melted half-wheel over potatoes (raclette).',
      tip: 'Fondue is a winter dish — order raclette in summer and you’ll blend in better.',
      mapQuery: 'Rheinfelder Bierhalle, Zürich',
    },
    {
      name: 'Swiss chocolate',
      category: 'food',
      area: 'Zürich',
      description:
        'Sprüngli on Paradeplatz for Luxemburgerli macarons and pralines; Lindt’s Home of Chocolate has a museum and a 9 m chocolate fountain.',
      mapQuery: 'Sprüngli Paradeplatz, Zürich',
    },
    {
      name: 'Zürich old town & Bahnhofstrasse',
      category: 'misc',
      area: 'Zürich',
      description:
        'The limmat-side lanes of Niederdorf meet one of the world’s most expensive shopping streets — walk from the lake up through the old town.',
      mapQuery: 'Niederdorf, Zürich',
    },
  ],
};
