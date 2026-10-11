import { CountryGuideData } from './types';

export const scotlandGuide: CountryGuideData = {
  country: 'Scotland',
  slug: 'scotland',
  title: 'Scotland',
  subtitle: 'Edinburgh, Stirling & the Highlands',
  heroImage: '/img/Scotland/scotland_panorama (3).jpg',
  heroAlt: 'Scotland panorama',
  mapContext: 'Scotland',

  intro: [
    'Scotland splits neatly into the Edinburgh–Stirling central belt (history and easy day trips) and the Highlands, which need a car or a tour to do justice. Stirling was a personal stop — the Wallace Monument there is one of my saved spots.',
    'Trains cover Edinburgh–Glasgow–Stirling well; for the Highlands, a rental car or a guided day tour from Edinburgh is the practical option.',
  ],

  gettingThere: [
    {
      title: 'Fly into Edinburgh (EDI)',
      text: 'The tram runs from the airport to Princes Street in about 35 minutes — drops you right at the foot of the castle.',
    },
    {
      title: 'Stirling is a 50-minute train',
      text: 'Edinburgh–Stirling trains run frequently from Waverley; the Wallace Monument is a short bus or uphill walk from Stirling station.',
    },
    {
      title: 'Highlands need wheels or a tour',
      text: 'Glencoe, Skye and Loch Ness are multi-hour drives — Rabbie’s and Timberbush run well-regarded small-group day tours from Edinburgh.',
    },
  ],

  routes: [{
    title: 'Edinburgh Walking Route',
    description:
      'The Royal Mile spine — castle at the top, Holyrood at the bottom, with Arthur’s Seat as the uphill finale for the best view.',
    stops: [
      { place: 'Edinburgh Castle' },
      { place: "St Giles' Cathedral" },
      { place: 'Victoria Street, Edinburgh' },
      { place: 'Greyfriars Kirkyard' },
      { place: 'Palace of Holyroodhouse' },
      { place: "Arthur's Seat" },
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
      name: 'Edinburgh Castle',
      category: 'landmarks',
      area: 'Edinburgh',
      description:
        'The fortress on the volcanic Castle Rock — home to the Scottish Crown Jewels, the Stone of Destiny and the daily One O’Clock Gun.',
      featured: true,
      wikiTitle: 'Edinburgh Castle',
      mapQuery: 'Edinburgh Castle',
    },
    {
      name: 'Royal Mile',
      category: 'landmarks',
      area: 'Edinburgh',
      description:
        'The medieval spine of the Old Town — one mile of closes, kirks and shops descending from the Castle to Holyrood Palace.',
      wikiTitle: 'Royal Mile',
      mapQuery: 'Royal Mile, Edinburgh',
    },
    {
      name: 'National Wallace Monument',
      category: 'landmarks',
      area: 'Stirling',
      description:
        'The 1869 Victorian tower on Abbey Craig honoring William Wallace — climb 246 steps for the view over the Stirling Bridge battlefield.',
      tip: 'My saved pin — the top platform looks straight down the Forth valley; Stirling Castle is visible from it too.',
      featured: true,
      wikiTitle: 'Wallace Monument',
      mapQuery: 'National Wallace Monument, Stirling',
    },
    {
      name: 'Stirling Castle',
      category: 'landmarks',
      area: 'Stirling',
      description:
        'The other great Scottish royal castle — Renaissance palace of the Stuart kings on a crag above the Forth, arguably grander inside than Edinburgh’s.',
      wikiTitle: 'Stirling Castle',
      mapQuery: 'Stirling Castle',
    },
    {
      name: 'Greyfriars Kirkyard',
      category: 'landmarks',
      area: 'Edinburgh',
      description:
        'The 16th-century graveyard famous for Greyfriars Bobby — the terrier who guarded his master’s grave for 14 years — and rows of atmospheric tombs.',
      mapQuery: 'Greyfriars Kirkyard, Edinburgh',
    },
    {
      name: "Arthur's Seat",
      category: 'outdoors',
      area: 'Edinburgh',
      description:
        'The extinct volcano at the end of the Royal Mile — a 40-minute climb to the highest point in Holyrood Park with a full city panorama.',
      tip: 'Go up the Salisbury Crags side at golden hour — the light over the Old Town roofs is unreal.',
      featured: true,
      wikiTitle: "Arthur's Seat",
      mapQuery: "Arthur's Seat, Edinburgh",
    },
    {
      name: 'Glencoe',
      category: 'outdoors',
      area: 'Highlands',
      description:
        'The great glen carved by glaciers — the Three Sisters peaks and the site of the 1692 massacre; the single most iconic Highland landscape.',
      wikiTitle: 'Glen Coe',
      mapQuery: 'Glencoe, Scotland',
    },
    {
      name: 'Loch Ness & Urquhart Castle',
      category: 'outdoors',
      area: 'Highlands',
      description:
        'The famous deep loch with the ruined castle on its shore — monster-hunting aside, the drive up the Great Glen is the reward.',
      wikiTitle: 'Urquhart Castle',
      mapQuery: 'Urquhart Castle, Loch Ness',
    },
    {
      name: 'Calton Hill',
      category: 'outdoors',
      area: 'Edinburgh',
      description:
        'The city’s acropolis — the unfinished National Monument columns, Nelson’s Monument and the classic sunset view down Princes Street.',
      mapQuery: 'Calton Hill, Edinburgh',
    },
    {
      name: 'Haggis, neeps & tatties',
      category: 'food',
      area: 'Everywhere',
      description:
        'The national dish — savory-spiced haggis with mashed turnip and potato, best tried in a pub like The Albanach on the Royal Mile or a specialist like Arcade.',
      mapQuery: 'The Albanach, Royal Mile, Edinburgh',
    },
    {
      name: 'Whisky experience',
      category: 'misc',
      area: 'Edinburgh / Highlands',
      description:
        'The Scotch Whisky Experience beside the castle runs barrel-ride tours and tastings; real distillery visits need a Highland day trip (Glenkinchie is the closest).',
      mapQuery: 'The Scotch Whisky Experience, Edinburgh',
    },
    {
      name: 'Victoria Street',
      category: 'misc',
      area: 'Edinburgh',
      description:
        'The curved, color-fronted street said to have inspired Diagon Alley — indie shops and the view down to the Grassmarket.',
      mapQuery: 'Victoria Street, Edinburgh',
    },
  ],
};
