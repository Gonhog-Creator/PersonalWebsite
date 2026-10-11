import { CountryGuideData } from './types';

export const ukGuide: CountryGuideData = {
  country: 'United Kingdom',
  slug: 'uk',
  title: 'United Kingdom',
  subtitle: 'A London city guide',
  heroImage: '/img/United Kingdom/united_kingdom_panorama (2).jpg',
  heroAlt: 'London panorama',
  mapContext: 'London, United Kingdom',

  intro: [
    'My UK photos center on London — a city where the classic sights actually live up to the hype. The tube gets you anywhere; the Thames path covers the rest.',
    'London is big — plan by neighborhood rather than trying to see everything. The walk below hits the riverside icons in one sweep.',
  ],

  gettingThere: [
    {
      title: 'Heathrow or Gatwick into the city',
      text: 'Heathrow has the Elizabeth line straight to the West End (30 min) or the cheaper Piccadilly line. Gatwick Express reaches Victoria in 30.',
    },
    {
      title: 'Stay in Zones 1–2',
      text: 'Southwark, Fitzrovia or anywhere along the Elizabeth line puts the whole city within 30 minutes — don’t pay West End prices.',
    },
    {
      title: 'Contactless is the Oyster card',
      text: 'Just tap a contactless card or phone on tube and bus readers — same fare caps, no ticket needed.',
    },
  ],

  routes: [{
    title: 'Thames Walking Route',
    description:
      'The riverside greatest-hits walk — Westminster to Tower Bridge along the South Bank, crossing at the Millennium Bridge for St Paul’s.',
    stops: [
      { place: 'Big Ben, London' },
      { place: 'Westminster Abbey' },
      { place: 'London Eye' },
      { place: 'Southbank Centre' },
      { place: 'Shakespeare\'s Globe' },
      { place: 'Millennium Bridge, London' },
      { place: "St Paul's Cathedral" },
      { place: 'Tower of London' },
      { place: 'Tower Bridge' },
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
      name: 'Westminster Abbey',
      category: 'landmarks',
      area: 'Westminster',
      description:
        'The coronation church since 1066 — royal tombs, Poets’ Corner and soaring Gothic vaults beside Parliament.',
      featured: true,
      wikiTitle: 'Westminster Abbey',
      mapQuery: 'Westminster Abbey, London',
    },
    {
      name: 'Tower of London',
      category: 'landmarks',
      area: 'Tower Hill',
      description:
        'The Norman fortress on the Thames — Crown Jewels, Yeoman Warders, ravens and a thousand years of executions and imprisonments.',
      featured: true,
      wikiTitle: 'Tower of London',
      mapQuery: 'Tower of London',
    },
    {
      name: "St Paul's Cathedral",
      category: 'landmarks',
      area: 'City of London',
      description:
        'Wren’s 1710 masterpiece — the great dome survived the Blitz and you can climb 528 steps to the Whispering Gallery and Golden Gallery.',
      wikiTitle: "St Paul's Cathedral",
      mapQuery: "St Paul's Cathedral, London",
    },
    {
      name: 'British Museum',
      category: 'landmarks',
      area: 'Bloomsbury',
      description:
        'The world’s first national museum — the Rosetta Stone, Parthenon marbles and Egyptian galleries under the Great Court’s glass roof. Free entry.',
      wikiTitle: 'British Museum',
      mapQuery: 'British Museum, London',
    },
    {
      name: 'Tower Bridge',
      category: 'landmarks',
      area: 'Southwark',
      description:
        'The 1894 bascule bridge often mistaken for London Bridge — glass-floor walkway in the high-level spans and the Victorian engine rooms.',
      wikiTitle: 'Tower Bridge',
      mapQuery: 'Tower Bridge, London',
    },
    {
      name: 'Buckingham Palace & the Mall',
      category: 'landmarks',
      area: 'Westminster',
      description:
        'The royal residence at the end of the ceremonial Mall — the Changing of the Guard runs most mornings at 11am.',
      wikiTitle: 'Buckingham Palace',
      mapQuery: 'Buckingham Palace, London',
    },
    {
      name: 'Regent\'s Park & Primrose Hill',
      category: 'outdoors',
      area: 'North London',
      description:
        'The royal park’s rose gardens and zoo, with the hill just north giving the classic sunset skyline over the City.',
      mapQuery: 'Primrose Hill, London',
    },
    {
      name: 'Hampstead Heath',
      category: 'outdoors',
      area: 'North London',
      description:
        '800 acres of wild parkland — swimming ponds, Kenwood House and Parliament Hill’s view over the whole city.',
      mapQuery: 'Hampstead Heath, London',
    },
    {
      name: 'South Bank',
      category: 'outdoors',
      area: 'Waterloo',
      description:
        'The riverside cultural strip — book market, buskers, skateboarders under the Southbank Centre and the view back to Parliament.',
      mapQuery: 'South Bank, London',
    },
    {
      name: 'Borough Market',
      category: 'food',
      area: 'Southwark',
      description:
        'London’s oldest food market under the railway arches — produce, street food and the famous Neal’s Yard cheese shop.',
      tip: 'Go hungry and graze — the sausage rolls and the doughnuts are the moves.',
      featured: true,
      mapQuery: 'Borough Market, London',
    },
    {
      name: 'Sunday roast & a proper pub',
      category: 'food',
      area: 'Everywhere',
      description:
        'The weekend institution — roast beef, Yorkshire pudding and gravy at a proper pub. The Mayflower by the river is a great riverside pick.',
      mapQuery: 'The Mayflower Pub, Rotherhithe, London',
    },
    {
      name: 'Camden Market',
      category: 'misc',
      area: 'Camden Town',
      description:
        'The alternative-culture market along the canal — food stalls, vintage shops and the Amy Winehouse connection on every corner.',
      mapQuery: 'Camden Market, London',
    },
    {
      name: 'West End theatre',
      category: 'misc',
      area: 'Soho/Covent Garden',
      description:
        'London’s theatre district — TKTS booth in Leicester Square sells same-day discounted tickets for the big musicals and plays.',
      mapQuery: 'TKTS Leicester Square, London',
    },
  ],
};
