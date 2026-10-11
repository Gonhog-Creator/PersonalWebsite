import { CountryGuideData } from './types';

export const norwayGuide: CountryGuideData = {
  country: 'Norway',
  slug: 'norway',
  title: 'Norway',
  subtitle: 'Oslo, Bergen & the fjords',
  heroImage: '/img/Norway/norway-panorama (1).jpg',
  heroAlt: 'Norway panorama',
  mapContext: 'Norway',

  intro: [
    'Norway’s draw is the scenery — the fjords west of Bergen and the mountains between the cities. Oslo is the practical entry point; the rail line to Bergen is itself one of the great scenic journeys.',
    'Book the Bergen Railway and fjord tours ahead in summer — seats and boat slots sell out. Norway is expensive; bakeries and supermarkets stretch a budget.',
  ],

  gettingThere: [
    {
      title: 'Fly into Oslo (OSL)',
      text: 'The Flytoget airport express reaches Oslo Central in 20 minutes; the regular train is cheaper and only slightly slower.',
    },
    {
      title: 'The Bergen Railway is the point',
      text: 'The 7-hour Oslo–Bergen line crosses the Hardangervidda plateau — the highest mainline in Europe. Sit on the left for the best views.',
    },
    {
      title: 'Norway in a Nutshell for first-timers',
      text: 'The packaged train-bus-boat loop through the Nærøyfjord and Flåm is touristy but genuinely the easiest way to see a fjord in a day.',
    },
  ],

  routes: [{
    title: 'Oslo Waterfront Walk',
    description:
      'A harbor-side afternoon — Opera House roof, the new MUNCH museum, Akershus fortress, then the Aker Brygge piers for dinner.',
    stops: [
      { place: 'Oslo Opera House' },
      { place: 'MUNCH museum, Oslo' },
      { place: 'Akershus Fortress' },
      { place: 'City Hall, Oslo' },
      { place: 'Aker Brygge' },
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
      name: 'Oslo Opera House',
      category: 'landmarks',
      area: 'Oslo',
      description:
        'The 2008 white marble opera house whose roof you can walk up — sloping down into the fjord like a glacier, with views over the city and harbor.',
      featured: true,
      wikiTitle: 'Oslo Opera House',
      mapQuery: 'Oslo Opera House',
    },
    {
      name: 'Vigeland Sculpture Park',
      category: 'landmarks',
      area: 'Oslo',
      description:
        'The world’s largest sculpture park by a single artist — 200+ bronze and granite figures by Gustav Vigeland inside Frogner Park, free entry.',
      wikiTitle: 'Frogner Park',
      mapQuery: 'Vigeland Sculpture Park, Oslo',
    },
    {
      name: 'Bryggen',
      category: 'landmarks',
      area: 'Bergen',
      description:
        'The UNESCO-listed row of wooden Hanseatic merchant houses along Bergen’s old wharf — leaning timber façades with workshops behind.',
      wikiTitle: 'Bryggen',
      mapQuery: 'Bryggen, Bergen',
    },
    {
      name: 'Norsk Folkemuseum',
      category: 'landmarks',
      area: 'Oslo',
      description:
        'The open-air museum on Bygdøy — 160 relocated buildings including the 12th-century Gol stave church.',
      wikiTitle: 'Norwegian Museum of Cultural History',
      mapQuery: 'Norwegian Museum of Cultural History, Oslo',
    },
    {
      name: 'Flåm & the Nærøyfjord',
      category: 'outdoors',
      area: 'Aurland',
      description:
        'The narrowest arm of the Sognefjord — a UNESCO fjord hemmed by 1,700 m cliffs, reached by the steep Flåm mountain railway.',
      featured: true,
      wikiTitle: 'Nærøyfjord',
      mapQuery: 'Flåm, Norway',
    },
    {
      name: 'Geirangerfjord',
      category: 'outdoors',
      area: 'Møre og Romsdal',
      description:
        'The most famous fjord — Seven Sisters and Suitor waterfalls facing each other across the water, viewed best from the Geiranger ferry or Flydalsjuvet.',
      wikiTitle: 'Geirangerfjord',
      mapQuery: 'Geiranger, Norway',
    },
    {
      name: 'Preikestolen (Pulpit Rock)',
      category: 'outdoors',
      area: 'Rogaland',
      description:
        'The flat cliff shelf 604 m above the Lysefjord — a 4-hour round-trip hike on stone steps, most famous ledge in Norway.',
      mapQuery: 'Preikestolen, Norway',
    },
    {
      name: 'Bygdøy museums peninsula',
      category: 'outdoors',
      area: 'Oslo',
      description:
        'The green peninsula west of the center — Fram polar ship museum, Kon-Tiki raft and the Viking Ship Museum, reached by a short ferry from the harbor.',
      mapQuery: 'Bygdøy, Oslo',
    },
    {
      name: 'Mount Fløyen & Fløibanen',
      category: 'outdoors',
      area: 'Bergen',
      description:
        'The funicular from the wharf climbs Bergen’s city mountain in 8 minutes — forest trails and the classic view over the seven mountains.',
      mapQuery: 'Fløibanen, Bergen',
    },
    {
      name: 'Bakeries & brown cheese',
      category: 'food',
      area: 'Everywhere',
      description:
        'The everyday Norwegian breakfast — skillingsboller cinnamon buns and brunost, the caramel-sweet brown whey cheese sliced thin on bread.',
      mapQuery: 'Baker Brun, Bergen',
    },
    {
      name: 'Mathallen Food Hall',
      category: 'food',
      area: 'Oslo',
      description:
        'The riverside food hall in Vulkan — 30 vendors from Norwegian seafood to Asian street food, the easiest one-stop eat in Oslo.',
      mapQuery: 'Mathallen, Oslo',
    },
    {
      name: 'Sauna culture on the fjord',
      category: 'misc',
      area: 'Oslo',
      description:
        'Floating saunas on Oslofjord — sauna rafts where you sweat then jump straight into the harbor. Book ahead on weekends.',
      mapQuery: 'Kok Oslo sauna, Langkaia',
    },
  ],
};
