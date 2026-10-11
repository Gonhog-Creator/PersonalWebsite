import { CountryGuideData } from './types';

export const romeGuide: CountryGuideData = {
  country: 'Rome',
  slug: 'italy/rome',
  title: 'Rome',
  subtitle: 'Ancient ruins & neighborhood trattorias',
  heroImage: '/img/Italy/Rome/rome-panorama (1).jpg',
  heroAlt: 'Rome panorama',
  mapContext: 'Rome, Italy',

  intro: [
    'Rome is overwhelming in the best way — 2,800 years of history stacked on top of itself, with the ancient center, the Vatican and the neighborhood districts (Trastevere, Testaccio) all pulling in different directions.',
    'The center is walkable but big — the metro covers the longer hops, and comfortable shoes are the single most important thing you pack.',
  ],

  gettingThere: [
    {
      title: 'Train into Termini',
      text: 'Termini is the hub for metro, trains and airport links — the Leonardo Express from Fiumicino takes 32 minutes direct.',
    },
    {
      title: 'Stay in Monti or near Termini',
      text: 'Monti puts you walking distance from the Colosseum with real restaurant life; Termini area is cheaper and transit-central.',
    },
    {
      title: 'Book the Vatican & Colosseum ahead',
      text: 'Both sell timed entries that run out — the Vatican especially can sell out weeks ahead in season.',
    },
  ],

  routes: [{
    title: 'Ancient Rome Walking Route',
    description:
      'The classic ancient-city loop — Colosseum and Forum in the morning, up the Capitoline, through the Centro Storico to the Pantheon and Trevi.',
    stops: [
      { place: 'Colosseum' },
      { place: 'Roman Forum' },
      { place: 'Palatine Hill' },
      { place: 'Capitoline Hill' },
      { place: 'Pantheon, Rome' },
      { place: 'Trevi Fountain' },
      { place: 'Piazza Navona' },
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
      name: 'Colosseum',
      category: 'landmarks',
      area: 'Ancient center',
      description:
        'The 80 AD amphitheatre that held 50,000 spectators — gladiator fights, naval battle reenactments and the underground hypogeum tunnels.',
      featured: true,
      wikiTitle: 'Colosseum',
      mapQuery: 'Colosseum, Rome',
    },
    {
      name: 'Roman Forum & Palatine Hill',
      category: 'landmarks',
      area: 'Ancient center',
      description:
        'The excavated heart of the empire — Senate house, triumphal arches and the hill where Rome was founded, one combined ticket with the Colosseum.',
      wikiTitle: 'Roman Forum',
      mapQuery: 'Roman Forum, Rome',
    },
    {
      name: 'Pantheon',
      category: 'landmarks',
      area: 'Centro Storico',
      description:
        'The best-preserved Roman building — a 43 m concrete dome with a 9 m oculus, built 126 AD and still the largest unreinforced dome in the world.',
      wikiTitle: 'Pantheon, Rome',
      mapQuery: 'Pantheon, Rome',
    },
    {
      name: 'Vatican Museums & Sistine Chapel',
      category: 'landmarks',
      area: 'Vatican City',
      description:
        'The 7 km museum route culminating in Michelangelo’s ceiling — St Peter’s Basilica and the climb up its dome are next door.',
      wikiTitle: 'Vatican Museums',
      mapQuery: 'Vatican Museums',
    },
    {
      name: 'Trevi Fountain',
      category: 'landmarks',
      area: 'Trevi',
      description:
        'The baroque fountain where you throw a coin to guarantee your return to Rome — lit up at night and mobbed by day.',
      tip: 'Go before 8am or after 10pm — midday it’s shoulder-to-shoulder.',
      wikiTitle: 'Trevi Fountain',
      mapQuery: 'Trevi Fountain, Rome',
    },
    {
      name: 'Spanish Steps & Piazza di Spagna',
      category: 'landmarks',
      area: 'Centro Storico',
      description:
        'The 135-step baroque stairway linking the piazza to the Trinità dei Monti church — sitting on the steps is now forbidden but the view holds.',
      wikiTitle: 'Spanish Steps',
      mapQuery: 'Spanish Steps, Rome',
    },
    {
      name: 'Trastevere',
      category: 'outdoors',
      area: 'West bank',
      description:
        'The ivy-covered quarter across the river — golden-hour lanes, the Santa Maria church’s apse mosaics and the city’s densest trattoria strip.',
      tip: 'Come for dinner and stay for the passeggiata — the neighborhood wakes up after 7pm.',
      featured: true,
      wikiTitle: 'Trastevere',
      mapQuery: 'Trastevere, Rome',
    },
    {
      name: 'Villa Borghese & Pincio Terrace',
      category: 'outdoors',
      area: 'North center',
      description:
        'Rome’s great park — boating lake, the Borghese Gallery (Bernini sculptures) and the terrace overlooking Piazza del Popolo.',
      mapQuery: 'Villa Borghese, Rome',
    },
    {
      name: 'Appian Way & catacombs',
      category: 'outdoors',
      area: 'South of center',
      description:
        'The ancient basalt highway lined with tombs and umbrella pines — rent a bike on Sundays when it’s closed to cars, catacombs of San Callisto en route.',
      wikiTitle: 'Appian Way',
      mapQuery: 'Appian Way, Rome',
    },
    {
      name: 'Carbonara & the Roman pastas',
      category: 'food',
      area: 'Everywhere',
      description:
        'The four Roman pastas — carbonara, cacio e pepe, amatriciana and gricia — ordered by rules: no cream, guanciale not bacon, pecorino not parmigiano.',
      tip: 'Roscioli or Felice a Testaccio for the canonical plates.',
      featured: true,
      mapQuery: 'Roscioli, Rome',
    },
    {
      name: 'Testaccio market',
      category: 'food',
      area: 'Testaccio',
      description:
        'The working-class food neighborhood — a covered market with porchetta sandwiches, Roman pizza al taglio and the original street-food stalls.',
      mapQuery: 'Mercato Testaccio, Rome',
    },
    {
      name: 'Aperitivo & spritz hour',
      category: 'food',
      area: 'Trastevere / Monti',
      description:
        'The 6–8pm ritual — an Aperol spritz or negroni with snacks at bar terraces; Bar del Fico near the Pantheon is the chess-players’ classic.',
      mapQuery: 'Bar del Fico, Rome',
    },
    {
      name: 'Jewish Ghetto',
      category: 'misc',
      area: 'Centro',
      description:
        'One of Europe’s oldest Jewish quarters — the Great Synagogue, the Portico of Octavia and carciofi alla giudia (fried artichokes) on every menu.',
      mapQuery: 'Jewish Ghetto, Rome',
    },
  ],
};
