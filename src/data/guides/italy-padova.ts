import { CountryGuideData } from './types';

export const padovaGuide: CountryGuideData = {
  country: 'Padova',
  slug: 'italy/padova',
  title: 'Padova',
  subtitle: 'Giotto\'s masterpiece & the university quarter',
  heroImage: '/img/Italy/Padova/padova-panorama-1.jpg',
  heroAlt: 'Padova panorama',
  mapContext: 'Padova, Italy',

  intro: [
    'Padova is the university city most tourists skip — 800 years of students, Giotto\'s frescoes at the Scrovegni Chapel, one of Europe\'s largest squares, and the world\'s oldest botanical garden.',
    'It\'s 30 minutes by train from Venice, which makes it both an easy day trip and a far cheaper place to stay while visiting the lagoon.',
  ],

  gettingThere: [
    {
      title: 'Train from Venice or Bologna',
      text: 'Padova is on the Venice–Milan line — 25–30 minutes from Venice Santa Lucia, hourly trains. The station is a 10-minute walk from the center.',
    },
    {
      title: 'The center is portico-walkable',
      text: 'Like Bologna, the old town is covered in arcades — everything below fits in a day on foot.',
    },
    {
      title: 'Book Scrovegni days ahead',
      text: 'The chapel admits 25 people per 15-minute slot and sells out — reserve online before you go.',
    },
  ],

  routes: [{
    title: 'Padova Walking Route',
    description:
      'The old-town circuit — Scrovegni first (timed entry), then the market squares, the Santo basilica, and the botanical garden to finish.',
    stops: [
      { place: 'Scrovegni Chapel' },
      { place: 'Palazzo della Ragione, Padua' },
      { place: 'Piazza delle Erbe, Padua' },
      { place: "University of Padua (Palazzo Bo')" },
      { place: 'Basilica of Saint Anthony, Padua' },
      { place: 'Prato della Valle' },
      { place: 'Orto Botanico, Padua' },
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
      name: 'Scrovegni Chapel',
      category: 'landmarks',
      area: 'Eremitani',
      description:
        'Giotto\'s 1305 fresco cycle — the Life of Christ painted in a private chapel, considered the birth of Western painting and UNESCO-listed.',
      featured: true,
      wikiTitle: 'Scrovegni Chapel',
      mapQuery: 'Scrovegni Chapel, Padova',
    },
    {
      name: 'Basilica of Saint Anthony',
      category: 'landmarks',
      area: 'Il Santo',
      description:
        'The pilgrimage basilica housing St Anthony\'s tomb — a Byzantine-Gothic hybrid with Donatello bronzes on the high altar.',
      wikiTitle: 'Basilica of Saint Anthony of Padua',
      mapQuery: 'Basilica of Saint Anthony, Padova',
    },
    {
      name: 'Palazzo della Ragione',
      category: 'landmarks',
      area: 'Center',
      description:
        'The medieval town hall — a vast frescoed great hall (81 m long) with the giant wooden horse Donatello inspired, market stalls underneath.',
      wikiTitle: 'Palazzo della Ragione, Padua',
      mapQuery: 'Palazzo della Ragione, Padova',
    },
    {
      name: "Palazzo Bo' (University)",
      category: 'landmarks',
      area: 'University quarter',
      description:
        'The 1222 university\'s historic seat — the world\'s first permanent anatomical theatre (1595) and Galileo\'s lectern on the guided tour.',
      wikiTitle: 'University of Padua',
      mapQuery: "Palazzo Bo', Padova",
    },
    {
      name: 'Prato della Valle',
      category: 'outdoors',
      area: 'South center',
      description:
        'One of Europe\'s largest squares — a 90,000 m² elliptical island ringed by a canal and 78 statues, filled with market and strollers.',
      featured: true,
      wikiTitle: 'Prato della Valle',
      mapQuery: 'Prato della Valle, Padova',
    },
    {
      name: 'Orto Botanico',
      category: 'outdoors',
      area: 'Center',
      description:
        'The world\'s oldest botanical garden still in its original spot (1545) — a circular UNESCO garden with a 1585 palm and new biodiversity wing.',
      wikiTitle: 'Orto Botanico di Padova',
      mapQuery: 'Orto Botanico, Padova',
    },
    {
      name: 'Euganean Hills',
      category: 'outdoors',
      area: 'South of the city',
      description:
        'The volcanic hills 20 minutes south — thermal springs at Abano Terme, wine villages like Arquà Petrarca and hiking through chestnut woods.',
      mapQuery: 'Colli Euganei, Padova',
    },
    {
      name: 'Caffè Pedrocchi',
      category: 'food',
      area: 'University quarter',
      description:
        'The 1831 "café without doors" — neoclassical rooms where students once plotted the 1848 revolt; the mint coffee is the house drink.',
      featured: true,
      mapQuery: 'Caffè Pedrocchi, Padova',
    },
    {
      name: 'Piazza delle Erbe market',
      category: 'food',
      area: 'Center',
      description:
        'The twin market squares (Erbe and Frutta) under the Palazzo della Ragione — produce, cheese and the salumeria stalls of the covered sottosalone.',
      mapQuery: 'Piazza delle Erbe, Padova',
    },
    {
      name: 'Spritz & student aperitivo',
      category: 'food',
      area: 'Piazza dei Signori',
      description:
        'Padova claims to have helped invent the spritz — cheap aperitivo in the squares around the university with €3 spritz and free snacks.',
      mapQuery: 'Piazza dei Signori, Padova',
    },
    {
      name: 'Venice day-trip base',
      category: 'misc',
      area: 'From Padova station',
      description:
        'Staying in Padova and day-tripping to Venice saves a fortune — 25 minutes by train, and you\'re back in a real city for dinner.',
      mapQuery: 'Padova railway station',
    },
  ],
};
