import { CountryGuideData } from './types';

export const australiaGuide: CountryGuideData = {
  country: 'Australia',
  slug: 'australia',
  title: 'Australia',
  subtitle: 'Sydney, Melbourne & the Queensland coast',
  heroImage: '/img/Australia/panorama-australia (10).jpg',
  heroAlt: 'Australia panorama',
  mapContext: 'Australia',

  intro: [
    'Australia rewards picking a few regions rather than trying to do it all. This guide covers the three areas I focused on: Sydney, Melbourne, and Queensland — the Great Barrier Reef and the sand island of K\'gari.',
    'Distances are enormous: Sydney–Cairns is a 3-hour flight, and reef trips depart mostly from Cairns or Port Douglas. In the cities, public transport plus walking is all you need.',
  ],

  gettingThere: [
    {
      title: 'Sydney (SYD) as the hub',
      text: 'Most international routes land in Sydney. Domestic hops to Melbourne, Cairns and Brisbane are frequent and cheap if booked ahead.',
    },
    {
      title: 'Reef trips leave from Cairns & Port Douglas',
      text: 'Book outer-reef boats out of Cairns or Port Douglas for the best coral; day trips typically include two snorkel stops.',
    },
    {
      title: "K'gari needs a 4WD or a tag-along tour",
      text: 'Ferries leave from Hervey Bay and Rainbow Beach. Without your own 4WD, a guided tag-along tour is the standard way to drive the island’s sand tracks.',
    },
  ],

  routes: [{
    title: '',
    description: '',
    stops: [],
  }],

  categories: [
    { id: 'landmarks', label: 'Landmarks & History', icon: 'mdi:bank' },
    { id: 'outdoors', label: 'Outdoors & Views', icon: 'mdi:tree' },
    { id: 'food', label: 'Food & Drink', icon: 'mdi:silverware-fork-knife' },
    { id: 'misc', label: 'Misc', icon: 'mdi:dots-horizontal-circle-outline' },
  ],

  places: [
    {
      name: 'Sydney Opera House',
      category: 'landmarks',
      area: 'Sydney',
      description:
        'Jørn Utzon’s sail-roofed icon on Bennelong Point, opened 1973 — the symbol of the city and a UNESCO World Heritage site.',
      tip: 'The classic photo is from Mrs Macquarie’s Chair at the end of the Botanic Garden — my saved pin.',
      featured: true,
      wikiTitle: 'Sydney Opera House',
      mapQuery: "Mrs Macquaries Rd, Sydney NSW 2000",
    },
    {
      name: 'Sydney Harbour Bridge',
      category: 'landmarks',
      area: 'Sydney',
      description:
        'The 1932 steel arch bridge joining the CBD to the North Shore. Walk the pedestrian path for free harbour views, or climb the arch on a guided tour.',
      wikiTitle: 'Sydney Harbour Bridge',
      mapQuery: 'Sydney Harbour Bridge',
    },
    {
      name: 'Hosier Lane & the CBD laneways',
      category: 'landmarks',
      area: 'Melbourne',
      description:
        'Melbourne’s famous street-art laneway opposite Federation Square — the murals change constantly and the cobbled alley is always busy.',
      wikiTitle: 'Hosier Lane',
      mapQuery: 'Hosier Lane, Melbourne',
    },
    {
      name: 'Queen Victoria Market',
      category: 'food',
      area: 'Melbourne',
      description:
        'The 19th-century open-air market sprawling over two city blocks — produce, deli halls and the famous hot jam doughnut van.',
      mapQuery: 'Queen Victoria Market, Melbourne',
    },
    {
      name: 'Great Barrier Reef',
      category: 'outdoors',
      area: 'Queensland',
      description:
        'The world’s largest coral reef system — a chain of 2,900 reefs stretching 2,300 km along the Queensland coast, best reached by boat from Cairns or Port Douglas.',
      tip: 'Four spots pinned on my map along the reef — outer-reef snorkel days are the way to see it.',
      featured: true,
      wikiTitle: 'Great Barrier Reef',
      mapQuery: 'Great Barrier Reef Marine Park, Queensland, Australia',
    },
    {
      name: "K'gari (Fraser Island)",
      category: 'outdoors',
      area: 'Queensland',
      description:
        'The world’s largest sand island — rainforest growing on pure sand, perched freshwater lakes like Boorangoora (Lake McKenzie), and 4WD-only beaches.',
      tip: 'Pinned on my map — do at least two days; the inland sand tracks are half the fun.',
      featured: true,
      wikiTitle: 'Fraser Island',
      mapQuery: "K'gari, Queensland, Australia",
    },
    {
      name: 'Bondi to Coogee Coastal Walk',
      category: 'outdoors',
      area: 'Sydney',
      description:
        'A 6 km cliff-top path linking Sydney’s eastern beaches — Bondi, Tamarama, Bronte and Coogee — with ocean pools along the way.',
      wikiTitle: 'Bondi to Coogee Walk',
      mapQuery: 'Bondi Beach, Sydney',
    },
    {
      name: 'Royal Botanic Garden Sydney',
      category: 'outdoors',
      area: 'Sydney',
      description:
        'A 30-hectare garden wrapping the harbour foreshore east of the Opera House, culminating at Mrs Macquarie’s Chair — the postcard harbour view.',
      wikiTitle: 'Royal Botanic Garden, Sydney',
      mapQuery: 'Royal Botanic Garden, Sydney',
    },
    {
      name: 'Manly Ferry',
      category: 'outdoors',
      area: 'Sydney',
      description:
        'The commuter ferry from Circular Quay to Manly — the cheapest harbour cruise in town, ending at a surf beach and the Shelly Beach snorkel walk.',
      mapQuery: 'Manly Ferry, Circular Quay, Sydney',
    },
    {
      name: 'Whitsunday Islands',
      category: 'outdoors',
      area: 'Queensland',
      description:
        '74 islands on the southern Great Barrier Reef including Whitehaven Beach — pure white silica sand — and the Hill Inlet lookout.',
      mapQuery: 'Whitsunday Islands, Queensland',
    },
    {
      name: 'St Kilda & Brighton Beach',
      category: 'outdoors',
      area: 'Melbourne',
      description:
        'Melbourne’s beach suburbs — the St Kilda pier little penguin colony at dusk and the row of colourful 1860s bathing boxes at Brighton.',
      mapQuery: 'Brighton Bathing Boxes, Melbourne',
    },
    {
      name: 'Chinatown Sydney',
      category: 'food',
      area: 'Sydney',
      description:
        'The dense cluster of restaurants and dessert bars along Dixon Street in Haymarket — a reliable late-night food stop.',
      mapQuery: 'Chinatown, Sydney',
    },
  ],
};
