import { CountryGuideData } from './types';

export const greeceGuide: CountryGuideData = {
  country: 'Greece',
  slug: 'greece',
  title: 'Greece',
  subtitle: 'Athens & the Dodecanese islands',
  heroImage: '/img/Greece/greece_panorama (5).jpg',
  heroAlt: 'Greece panorama',
  mapContext: 'Greece',

  intro: [
    'My Greece trip split between Athens and the Dodecanese — the southeastern island chain near Turkey. My saved spots were Rhodes (Archangelos on the east coast), Leros, and Kalymnos, which is one of the world’s great rock-climbing islands.',
    'Ferries are the transport between islands — Kos is the Dodecanese hub with airport and ferry connections to Kalymnos, Leros and Rhodes.',
  ],

  gettingThere: [
    {
      title: 'Fly into Athens (ATH) or Kos (KGS)',
      text: 'For the islands, flying to Kos and ferrying onward is faster than taking the long ferry from Piraeus.',
    },
    {
      title: 'Island ferries from Kos',
      text: 'Kalymnos is 45 minutes from Kos’ Mastichari port; Rhodes is a longer catamaran from Kos town. Ferryhopper lists every schedule.',
    },
    {
      title: 'Scooter or car on the islands',
      text: 'The small islands have sparse buses — a rented scooter or small car is how everyone reaches the beaches and crags.',
    },
  ],

  routes: [{
    title: 'Athens Walking Route',
    description:
      'The ancient Athens loop — Acropolis early, down through the Acropolis Museum and into the Plaka lanes for the afternoon.',
    stops: [
      { place: 'Acropolis of Athens' },
      { place: 'Parthenon' },
      { place: 'Theatre of Dionysus' },
      { place: 'Acropolis Museum' },
      { place: 'Plaka, Athens' },
      { place: 'Ancient Agora of Athens' },
      { place: 'Monastiraki Square' },
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
      name: 'Acropolis & Parthenon',
      category: 'landmarks',
      area: 'Athens',
      description:
        'The 5th-century BC citadel crowned by the Parthenon — the defining monument of classical Greece, visible from almost everywhere in the city.',
      tip: 'First entry of the day avoids both the heat and the cruise crowds.',
      featured: true,
      wikiTitle: 'Acropolis of Athens',
      mapQuery: 'Faidonos 1, Athens',
    },
    {
      name: 'Acropolis Museum',
      category: 'landmarks',
      area: 'Athens',
      description:
        'The glass-floored museum at the foot of the hill — the top-floor Parthenon Gallery faces the real temple with the surviving marbles aligned to it.',
      wikiTitle: 'Acropolis Museum',
      mapQuery: 'Acropolis Museum, Athens',
    },
    {
      name: 'Plaka',
      category: 'landmarks',
      area: 'Athens',
      description:
        'The old neighborhood under the Acropolis — neoclassical lanes, tavernas and the tiny Anafiotika quarter built like a Cycladic village.',
      wikiTitle: 'Plaka',
      mapQuery: 'Plaka, Athens',
    },
    {
      name: 'Palace of the Grand Master',
      category: 'landmarks',
      area: 'Rhodes Old Town',
      description:
        'The 14th-century Knights Hospitaller fortress-palace anchoring Rhodes’ UNESCO-listed medieval old town — a whole walled city intact.',
      wikiTitle: 'Palace of the Grand Master of the Knights of Rhodes',
      mapQuery: 'Palace of the Grand Master, Rhodes',
    },
    {
      name: 'Lindos Acropolis',
      category: 'landmarks',
      area: 'Rhodes',
      description:
        'The white village beneath an ancient acropolis — Doric temple remains and a medieval castle above St Paul’s Bay.',
      mapQuery: 'Lindos, Rhodes',
    },
    {
      name: 'Archangelos village',
      category: 'landmarks',
      area: 'Rhodes',
      description:
        'The traditional east-coast village — whitewashed houses, a hilltop castle ruin and tavernas that feel nothing like the resort coast.',
      tip: 'My pinned spot on Rhodes — quieter and more local than Lindos.',
      featured: true,
      mapQuery: 'Archangelos, Rhodes, Greece',
    },
    {
      name: 'Kalymnos climbing & beaches',
      category: 'outdoors',
      area: 'Kalymnos',
      description:
        'The former sponge-diving island turned world climbing destination — hundreds of bolted limestone routes over the sea, plus quiet Telendos island offshore.',
      tip: 'Pinned on my map — even without climbing, the seaside villages (Masouri, Myrties) and ferries are the draw.',
      featured: true,
      wikiTitle: 'Kalymnos',
      mapQuery: 'Kalymnos, Greece',
    },
    {
      name: 'Leros',
      category: 'outdoors',
      area: 'Dodecanese',
      description:
        'The quiet harbor island — Pandeli castle above Agia Marina, artillery tunnels at Lakki and almost no tourism infrastructure.',
      tip: 'Pinned on my map — the most low-key of the Dodecanese chain.',
      featured: true,
      wikiTitle: 'Leros',
      mapQuery: 'Leros, Greece',
    },
    {
      name: 'Pserimos',
      category: 'outdoors',
      area: 'Dodecanese',
      description:
        'The tiny sandy island between Kalymnos and Kos — essentially one beach taverna strip and boat-day-trip crowds that clear by evening.',
      mapQuery: 'Pserimos, Greece',
    },
    {
      name: 'Monastiraki & Psyrri',
      category: 'misc',
      area: 'Athens',
      description:
        'The flea-market square below the Acropolis and the bar district behind it — rooftop terraces face the lit-up Parthenon at night.',
      mapQuery: 'Monastiraki, Athens',
    },
    {
      name: 'Gyros & souvlaki',
      category: 'food',
      area: 'Athens',
      description:
        'The street-food staple — pork or chicken gyro wrapped in pita with tzatziki for a few euros, best from the standing counters in Monastiraki.',
      mapQuery: 'Kostas souvlaki, Athens',
    },
  ],
};
