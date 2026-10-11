import { CountryGuideData } from './types';

export const florenceGuide: CountryGuideData = {
  country: 'Florence',
  slug: 'italy/florence',
  title: 'Florence',
  subtitle: 'Renaissance art, markets & the Chianti hills',
  heroImage: '/img/Italy/Florence/florence-panorama (1).jpg',
  heroAlt: 'Florence panorama',
  mapContext: 'Florence, Italy',

  intro: [
    'Florence is the Renaissance in one walkable city — the Duomo, Uffizi and Michelangelo’s David all within a compact center. My saved spots were the San Lorenzo market streets and the Chianti hills south of the city.',
    'The historic center is tiny and pedestrianized — the only transit you need is your feet, plus a bus or rental for the Tuscan countryside.',
  ],

  gettingThere: [
    {
      title: 'Train into Santa Maria Novella',
      text: 'SMN station is a 10-minute walk from the Duomo — Florence is on the high-speed Rome–Milan line, making it an easy stopover.',
    },
    {
      title: 'Stay near San Lorenzo or Santa Croce',
      text: 'San Lorenzo puts the market and Duomo at your door; Santa Croce has the better restaurant and bar scene.',
    },
    {
      title: 'Book the big sights ahead',
      text: 'Uffizi and the Duomo climb sell out days ahead in season — reserve timed slots online before you arrive.',
    },
  ],

  routes: [{
    title: 'Florence Walking Route',
    description:
      'The full Renaissance circuit — Duomo and baptistery, Signoria’s sculpture garden, over the Ponte Vecchio, ending at Piazzale Michelangelo for the sunset view.',
    stops: [
      { place: 'Florence Cathedral (Duomo)' },
      { place: 'Florence Baptistery' },
      { place: 'Piazza della Signoria' },
      { place: 'Uffizi Gallery' },
      { place: 'Ponte Vecchio' },
      { place: 'Piazzale Michelangelo' },
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
      name: 'Duomo & Brunelleschi’s Dome',
      category: 'landmarks',
      area: 'Centro',
      description:
        'The cathedral crowned by the largest masonry dome ever built — climb 463 steps between the inner and outer shells for the city panorama.',
      featured: true,
      wikiTitle: 'Florence Cathedral',
      mapQuery: 'Florence Cathedral',
    },
    {
      name: 'Uffizi Gallery',
      category: 'landmarks',
      area: 'Signoria',
      description:
        'The world’s greatest Renaissance collection — Botticelli’s Birth of Venus and Primavera, plus Michelangelo, Leonardo and Caravaggio.',
      wikiTitle: 'Uffizi',
      mapQuery: 'Uffizi Gallery, Florence',
    },
    {
      name: 'Accademia — Michelangelo’s David',
      category: 'landmarks',
      area: 'San Marco',
      description:
        'The 5.2 m marble David at the end of a corridor of unfinished Slaves — the single most famous sculpture on earth.',
      wikiTitle: 'David (Michelangelo)',
      mapQuery: 'Galleria dell\'Accademia, Florence',
    },
    {
      name: 'Ponte Vecchio',
      category: 'landmarks',
      area: 'Arno river',
      description:
        'The medieval bridge lined with goldsmith shops — the only Florentine bridge to survive WWII, topped by the secret Vasari Corridor.',
      wikiTitle: 'Ponte Vecchio',
      mapQuery: 'Ponte Vecchio, Florence',
    },
    {
      name: 'Piazzale Michelangelo',
      category: 'outdoors',
      area: 'Oltrarno',
      description:
        'The hilltop terrace with the definitive Florence view — Duomo, tower and red roofs laid out at sunset. Bring a bottle and sit on the steps.',
      featured: true,
      mapQuery: 'Piazzale Michelangelo, Florence',
    },
    {
      name: 'Boboli Gardens',
      category: 'outdoors',
      area: 'Oltrarno',
      description:
        'The Medici’s back garden behind Palazzo Pitti — grottos, fountains and a steep climb to a hidden porcelain museum viewpoint.',
      wikiTitle: 'Boboli Gardens',
      mapQuery: 'Boboli Gardens, Florence',
    },
    {
      name: 'Oltrarno artisan quarter',
      category: 'outdoors',
      area: 'Santo Spirito',
      description:
        'The "other side of the Arno" — leather workshops, printmakers and the lively Santo Spirito square with aperitivo crowds.',
      mapQuery: 'Santo Spirito, Florence',
    },
    {
      name: 'Mercato Centrale & San Lorenzo',
      category: 'food',
      area: 'San Lorenzo',
      description:
        'The iron-and-glass market — lampredotto stalls downstairs, a huge modern food hall upstairs, surrounded by the leather street stalls.',
      tip: 'My saved pin — the upstairs food hall is the easiest great lunch in the center.',
      featured: true,
      mapQuery: 'Via dell\'Ariento, Florence',
    },
    {
      name: 'Bistecca alla fiorentina',
      category: 'food',
      area: 'Everywhere',
      description:
        'The T-bone ritual — thick-cut Chianina beef, charred outside and rare inside, priced by weight. Trattoria Mario is the no-frills classic.',
      mapQuery: 'Trattoria Mario, Florence',
    },
    {
      name: 'Gelato rules',
      category: 'food',
      area: 'Everywhere',
      description:
        'Real gelato is muted colors in covered tins, not neon piles — La Carraia and Santa Trinita are the local benchmarks.',
      mapQuery: 'Gelateria La Carraia, Florence',
    },
    {
      name: 'Chianti day trip',
      category: 'misc',
      area: 'Radda / Greve',
      description:
        'The wine hills 45 minutes south — cypress roads, vineyard estates and villages like Radda and Greve. My saved pin was on a backroad near Radda.',
      featured: true,
      mapQuery: 'Radda in Chianti, Siena',
    },
  ],
};
