import { CountryGuideData } from './types';

export const estoniaGuide: CountryGuideData = {
  country: 'Estonia',
  slug: 'estonia',
  title: 'Estonia',
  subtitle: 'A Tallinn old town guide',
  heroImage: '/img/Estonia/estonia-panorama (2).jpg',
  heroAlt: 'Tallinn panorama',
  mapContext: 'Tallinn, Estonia',

  intro: [
    'Estonia for me was Tallinn — and Tallinn is essentially the medieval Old Town, one of the best-preserved in Europe. The upper town (Toompea) gives the postcard views; the lower town has the lanes, churches and merchant houses.',
    'The Old Town is pedestrianized and small — you can see it all on foot in a day, with the Telliskivi creative district a short tram ride away for the evening.',
  ],

  gettingThere: [
    {
      title: 'Ferry or flight into Tallinn',
      text: 'Tallinn Airport (TLL) is 15 minutes from the center by tram. From Helsinki it’s a 2-hour ferry — the classic way to arrive.',
    },
    {
      title: 'Stay near the Old Town walls',
      text: 'Everything medieval is inside the walls; the Rotermann quarter just outside has modern hotels within a 5-minute walk.',
    },
    {
      title: 'Walk the Old Town, tram to Telliskivi',
      text: 'The Old Town is car-free. Telliskivi Creative City and the Balti Jaam market are a 15-minute walk or 2-stop tram from the walls.',
    },
  ],

  routes: [{
    title: 'Tallinn Old Town Loop',
    description:
      'A half-day circuit covering the lower town lanes, the Toompea viewpoints and the town wall — start at Viru Gate and finish at St. Olaf’s spire.',
    stops: [
      { place: 'Viru Gate, Tallinn' },
      { place: 'Town Hall Square, Tallinn' },
      { place: 'St. Catherine’s Passage, Tallinn' },
      { place: 'Kohtuotsa viewing platform' },
      { place: 'Alexander Nevsky Cathedral, Tallinn' },
      { place: 'Toompea Castle' },
      { place: 'Danish King’s Garden, Tallinn' },
      { place: "St. Olaf's Church, Tallinn" },
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
      name: 'Old Town (Vanalinn)',
      category: 'landmarks',
      area: 'Center',
      description:
        'The UNESCO-listed medieval core — intact 13th–16th century walls, towers and Hanseatic merchant houses packed into less than a square kilometer.',
      featured: true,
      wikiTitle: 'Vanalinn',
      mapQuery: 'Tallinn Old Town',
    },
    {
      name: 'Town Hall & Raekoja Plats',
      category: 'landmarks',
      area: 'Lower town',
      description:
        'The only surviving Gothic town hall in Northern Europe (1404) on the market square that has hosted markets since the 11th century.',
      wikiTitle: 'Tallinn Town Hall',
      mapQuery: 'Town Hall Square, Tallinn',
    },
    {
      name: 'Alexander Nevsky Cathedral',
      category: 'landmarks',
      area: 'Toompea',
      description:
        'The onion-domed Russian Orthodox cathedral built in 1900 atop Toompea hill — Tallinn’s most photographed façade.',
      wikiTitle: 'Alexander Nevsky Cathedral, Tallinn',
      mapQuery: 'Alexander Nevsky Cathedral, Tallinn',
    },
    {
      name: "St. Olaf's Church",
      category: 'landmarks',
      area: 'Lower town',
      description:
        'Once the tallest building in the world (1549–1625) at 159 m — the slim spire still defines the skyline and the tower is climbable in season.',
      wikiTitle: "St. Olaf's Church, Tallinn",
      mapQuery: "St. Olaf's Church, Tallinn",
    },
    {
      name: 'KGB Museum (Hotel Viru)',
      category: 'landmarks',
      area: 'City center',
      description:
        'The secret listening station on the hotel’s sealed 23rd floor, left as the KGB abandoned it in 1991 — visits are guided-tour only.',
      mapQuery: 'KGB Museum, Hotel Viru, Tallinn',
    },
    {
      name: 'Kohtuotsa & Patkuli viewpoints',
      category: 'outdoors',
      area: 'Toompea',
      description:
        'The two classic platforms on the upper town cliff — red rooftops, church spires and the port behind, the postcard Tallinn view.',
      tip: 'Kohtuotsa faces the Old Town roofs; Patkuli frames the wall towers — both are 2 minutes apart.',
      featured: true,
      mapQuery: 'Kohtuotsa viewing platform, Tallinn',
    },
    {
      name: 'Danish King’s Garden',
      category: 'outdoors',
      area: 'Toompea',
      description:
        'The terraced garden where legend says the Danish flag fell from the sky in 1219 — monk statues and views over the wall towers.',
      mapQuery: "Danish King's Garden, Tallinn",
    },
    {
      name: 'City wall walk',
      category: 'outdoors',
      area: 'Old Town perimeter',
      description:
        'A section of the 13th-century wall near Nunne tower is walkable — connecting three towers with views along the moat.',
      mapQuery: 'Nunne tower, Tallinn',
    },
    {
      name: 'Balti Jaam Market',
      category: 'food',
      area: 'Kalamaja',
      description:
        'The restored market halls behind the station — Estonian street food, black bread, pickles and a flea market upstairs.',
      mapQuery: 'Balti Jaam Market, Tallinn',
    },
    {
      name: 'Olde Hansa',
      category: 'food',
      area: 'Old Town',
      description:
        'The famous candlelit medieval tavern next to the Town Hall — game sausages, honey beer and staff in period dress. Touristy but an experience.',
      mapQuery: 'Olde Hansa, Tallinn',
    },
    {
      name: 'Telliskivi Creative City',
      category: 'misc',
      area: 'Kalamaja',
      description:
        'A former factory complex turned food hall, bars and indie shops — where Tallinn’s hipster quarter lives, just outside the walls.',
      tip: 'Come in the evening — Fotografiska is in the same complex.',
      mapQuery: 'Telliskivi Creative City, Tallinn',
    },
    {
      name: 'Fotografiska Tallinn',
      category: 'misc',
      area: 'Telliskivi',
      description:
        'The Tallinn outpost of the Stockholm photography museum — rotating contemporary exhibitions plus a well-regarded rooftop restaurant.',
      mapQuery: 'Fotografiska Tallinn',
    },
  ],
};
