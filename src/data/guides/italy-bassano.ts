import { CountryGuideData } from './types';

export const bassanoGuide: CountryGuideData = {
  country: 'Bassano del Grappa',
  slug: 'italy/bassano-del-grappa',
  title: 'Bassano del Grappa',
  subtitle: 'The wooden bridge town on the Brenta',
  heroImage: '/img/Italy/Bassano/bassano-panorama (1).jpg',
  heroAlt: 'Bassano del Grappa panorama',
  mapContext: 'Bassano del Grappa, Italy',

  intro: [
    'Bassano del Grappa is a riverside town under Monte Grappa — famous for its covered wooden bridge (the Ponte degli Alpini), the grappa distilleries on its banks, and a compact medieval old town.',
    'It\'s an easy day trip from Venice or Padova — about an hour by train — and pairs perfectly with nearby Marostica and the Veneto foothills.',
  ],

  gettingThere: [
    {
      title: 'Train from Padova or Venice',
      text: 'Direct trains from Padova run about an hour; from Venice it\'s ~1h15 with a possible change. The station is a 10-minute walk to the bridge.',
    },
    {
      title: 'The old town is tiny',
      text: 'Everything is within a 15-minute walk of the bridge — Bassano is a half-day-to-one-day town.',
    },
    {
      title: 'Grappa distilleries line the river',
      text: 'Nardini and Poli both have tasting rooms by the bridge — no tour needed, just walk in.',
    },
  ],

  routes: [{
    title: 'Bassano Walking Route',
    description:
      'The old-town circuit — bridge to castle to main squares, ending at the grappa shops by the river.',
    stops: [
      { place: 'Ponte degli Alpini (Ponte Vecchio)' },
      { place: 'Nardini distillery' },
      { place: 'Piazza Libertà, Bassano del Grappa' },
      { place: 'Piazza Garibaldi, Bassano del Grappa' },
      { place: 'Castello degli Ezzelini' },
      { place: 'Civic Museum, Bassano' },
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
      name: 'Ponte degli Alpini (Ponte Vecchio)',
      category: 'landmarks',
      area: 'River Brenta',
      description:
        'The covered wooden bridge over the Brenta — rebuilt many times since 1209 to Palladio\'s 1569 design, named for the Alpine troops who defended it.',
      featured: true,
      wikiTitle: 'Ponte Vecchio, Bassano del Grappa',
      mapQuery: 'Ponte degli Alpini, Bassano del Grappa',
    },
    {
      name: 'Castello degli Ezzelini',
      category: 'landmarks',
      area: 'Hilltop',
      description:
        'The medieval castle above the town — towers, ramparts and a cathedral inside the walls, with views over the Brenta valley.',
      mapQuery: 'Castello degli Ezzelini, Bassano del Grappa',
    },
    {
      name: 'Piazza Libertà & Piazza Garibaldi',
      category: 'landmarks',
      area: 'Center',
      description:
        'The twin squares of the old town — the Lion of St Mark column, the Ossario memorial and the arcaded shops and cafés.',
      mapQuery: 'Piazza Libertà, Bassano del Grappa',
    },
    {
      name: 'Museo della Ceramica',
      category: 'landmarks',
      area: 'Palazzo Sturm',
      description:
        'Bassano\'s majolica tradition — the palace museum tracing the town\'s centuries of painted ceramics and printmaking.',
      mapQuery: 'Palazzo Sturm, Bassano del Grappa',
    },
    {
      name: 'Monte Grappa',
      category: 'outdoors',
        area: '30 min drive',
      description:
        'The WWI mountain towering behind the town — the vast ossuary memorial at the summit, paragliding launches and alpine hikes.',
      tip: 'The cable car and winding road up are an attraction themselves — the memorial at the top is sobering.',
      featured: true,
      wikiTitle: 'Monte Grappa',
      mapQuery: 'Sacrario militare del Monte Grappa',
    },
    {
      name: 'Brenta river walk',
      category: 'outdoors',
      area: 'Riverside',
      description:
        'The path along the river — kayakers under the bridge, the alpine backdrop and the best angle for photos of the Ponte Vecchio.',
      mapQuery: 'Lungobrenta, Bassano del Grappa',
    },
    {
      name: 'Marostica',
      category: 'outdoors',
      area: '8 km west',
      description:
        'The walled castle town with the human chess game in the main square — a 15-minute bus or bike ride from Bassano.',
      wikiTitle: 'Marostica',
      mapQuery: 'Marostica, Italy',
    },
    {
      name: 'Nardini & Poli grappa tasting',
      category: 'food',
      area: 'By the bridge',
      description:
        'The two historic distilleries on the bridge — Nardini (1779) and Poli run free tastings of their grappas right at the foot of the Ponte Vecchio.',
      tip: 'Nardini\'s bar is the oldest operating distillery in Italy — get the mezzo e mezzo aperitivo.',
      featured: true,
      mapQuery: 'Grapperia Nardini, Bassano del Grappa',
    },
    {
      name: 'Bigoli & baccalà',
      category: 'food',
      area: 'Old town',
      description:
        'The local table — thick bigoli pasta with duck ragù or anchovy sauce, and the Venetian salt-cod staple baccalà alla vicentina.',
      mapQuery: 'Trattoria al Borgo, Bassano del Grappa',
    },
    {
      name: 'Grappa itself',
      category: 'food',
      area: 'Everywhere',
      description:
        'The town\'s namesake spirit — distilled from grape pomace since the 18th century; aged (invecchiata) is smoother than the young white.',
      mapQuery: 'Poli Museo della Grappa, Bassano del Grappa',
    },
  ],
};
