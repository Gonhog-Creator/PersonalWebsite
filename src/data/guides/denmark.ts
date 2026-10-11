import { CountryGuideData } from './types';

export const denmarkGuide: CountryGuideData = {
  country: 'Denmark',
  slug: 'denmark',
  title: 'Denmark',
  subtitle: 'A Copenhagen city guide',
  heroImage: '/img/Denmark/denmark-panorama (7).jpg',
  heroAlt: 'Copenhagen panorama',
  mapContext: 'Copenhagen, Denmark',

  intro: [
    'I only made it to Copenhagen on this trip, so this guide is centered entirely on the capital. I flew into Copenhagen Airport (CPH) and took the train straight into the city center — it takes about 15 minutes and drops you right at Central Station.',
    'I stayed at Next House Copenhagen, a hostel a short walk from Central Station, which made a great budget base. The city is extremely walkable and everything on this list can be reached on foot or by the driverless Metro.',
  ],

  gettingThere: [
    {
      title: 'Fly into CPH, take the train',
      text: 'Copenhagen Airport (CPH) is connected to the city by both the regional train and Metro line M2. Both reach the center in roughly 15 minutes — take the train to København H (Central Station) or the Metro to Kongens Nytorv.',
    },
    {
      title: 'Stay near Central Station',
      text: 'I stayed at Next House Copenhagen, a big budget hostel near København H. It put most of the sights on this page within a 20-minute walk.',
    },
    {
      title: 'Walk or metro everywhere',
      text: 'The inner city is compact and flat. The walking route below covers the main sights in one day; the Metro fills in the gaps for Christiania, Amager and the harbour.',
    },
  ],

  routes: [{
    title: 'My Suggested Walking Route',
    description:
      'A roughly 8 km loop covering the classic Copenhagen sights. Start at Nørreport, finish back near the center — easy to split over a day with a lunch stop near Nyhavn.',
    stops: [
      { place: 'The Palm House (Botanical Garden)', query: 'Palm House, Botanical Garden, Copenhagen' },
      { place: 'Rosenborg Castle' },
      { place: 'Amalienborg Palace' },
      { place: "Frederik's Church (Marble Church)", query: "Frederik's Church, Copenhagen" },
      { place: "St Alban's Church" },
      { place: 'Nyhavn' },
      { place: 'Christiansborg Palace' },
      { place: 'Ny Carlsberg Glyptotek' },
      { place: 'Copenhagen City Hall', query: 'Copenhagen City Hall, Rådhuspladsen' },
      { place: 'The Round Tower (Rundetårn)', query: 'Rundetårn, Copenhagen' },
    ],
  }],

  categories: [
    { id: 'landmarks', label: 'Landmarks & History', icon: 'mdi:bank' },
    { id: 'outdoors', label: 'Outdoors & Views', icon: 'mdi:tree' },
    { id: 'food', label: 'Food & Drink', icon: 'mdi:silverware-fork-knife' },
    { id: 'misc', label: 'Misc', icon: 'mdi:dots-horizontal-circle-outline' },
  ],

  places: [
    // ---- Landmarks & History ----
    {
      name: 'The Round Tower (Rundetårn)',
      category: 'landmarks',
      area: 'Indre By',
      description:
        'A 17th-century tower built by Christian IV as an astronomical observatory. A spiral ramp — no stairs — winds 7.5 turns to a platform with views over the old town.',
      tip: 'The ramp is easy on the legs and the view is the best cheap panorama in the city.',
      featured: true,
      wikiTitle: 'Rundetaarn',
      mapQuery: 'Rundetårn, Copenhagen, Denmark',
    },
    {
      name: 'Freetown Christiania',
      category: 'landmarks',
      area: 'Christianshavn',
      description:
        'A self-proclaimed autonomous commune founded in 1971 on abandoned military barracks, known for its alternative community and colorful homemade architecture.',
      tip: 'Walk the ramparts and the lake path — the quiet side is the best part.',
      featured: true,
      wikiTitle: 'Freetown Christiania',
    },
    {
      name: 'Rosenborg Castle',
      category: 'landmarks',
      area: "King's Garden",
      description:
        'A Renaissance castle built by Christian IV in the early 1600s. It houses the Danish crown jewels and royal regalia, and sits in the lovely Kongens Have park.',
      featured: true,
      wikiTitle: 'Rosenborg Castle',
    },
    {
      name: 'Copenhagen City Hall',
      category: 'landmarks',
      area: 'Rådhuspladsen',
      description:
        'The seat of the city council, opened in 1905 on the main square. It houses Jens Olsen’s World Clock, an astronomical clock with over 14,000 mechanical parts.',
      wikiTitle: 'Copenhagen City Hall',
      mapQuery: 'Copenhagen City Hall, Rådhuspladsen, Copenhagen',
    },
    {
      name: 'Amalienborg',
      category: 'landmarks',
      area: 'Frederiksstaden',
      description:
        'The residence of the Danish royal family: four identical rococo palaces arranged around an octagonal courtyard facing the harbour.',
      tip: 'The changing of the guard happens daily at noon.',
      featured: true,
      wikiTitle: 'Amalienborg',
      mapQuery: 'Amalienborg Palace, Copenhagen',
    },
    {
      name: "Frederik's Church (Marble Church)",
      category: 'landmarks',
      area: 'Frederiksstaden',
      description:
        'A rococo church directly opposite Amalienborg, crowned by the largest church dome in Scandinavia — inspired by St Peter’s Basilica in Rome.',
      wikiTitle: "Frederik's Church, Copenhagen",
      mapQuery: "Frederik's Church, Copenhagen",
    },
    {
      name: 'Trinitatis Church',
      category: 'landmarks',
      area: 'Indre By',
      description:
        'A 17th-century church commissioned by Christian IV, forming one complex with the Round Tower and the old university library.',
      wikiTitle: 'Trinitatis Church',
    },
    {
      name: "St Alban's Church",
      category: 'landmarks',
      area: 'Churchillparken',
      description:
        'Copenhagen’s Anglican “English Church”, built in the 1880s in Gothic Revival style next to the Gefion Fountain and the star-shaped Kastellet fortress.',
      tip: 'Combine it with a walk around Kastellet — the fortress grounds are free to enter.',
      wikiTitle: "St. Alban's Church, Copenhagen",
      mapQuery: "St Alban's Church, Copenhagen",
    },
    {
      name: 'Skibene på Holmen',
      category: 'landmarks',
      area: 'Nyholm, Holmen',
      description:
        'Denmark’s floating Cold War museum: the frigate Peder Skram, a submarine and a missile boat moored at the old naval base — all open to board and explore.',
      tip: 'Run by volunteers, so check opening days before you go.',
      mapQuery: 'Skibene på Holmen, Elefanten, Copenhagen',
    },
    {
      name: 'Royal Danish Opera House',
      category: 'landmarks',
      area: 'Holmen',
      description:
        'The national opera house on the harbourfront, opened in 2005 — a giant neo-futurist building facing Amalienborg across the water.',
      wikiTitle: 'Copenhagen Opera House',
      mapQuery: 'Copenhagen Opera House, Copenhagen',
    },
    {
      name: 'Christiansborg Palace',
      category: 'landmarks',
      area: 'Slotsholmen',
      description:
        'The seat of the Danish Parliament, the Prime Minister’s Office and the Supreme Court — the only building in the world housing all three branches of a government.',
      tip: 'The tower viewing platform is free and one of the best views in the city.',
      featured: true,
      wikiTitle: 'Christiansborg Palace',
    },
    {
      name: 'Ny Carlsberg Glyptotek',
      category: 'landmarks',
      area: 'Indre By',
      description:
        'An art museum founded by the Carlsberg brewing family, holding French sculpture, Egyptian antiquities and Danish Golden Age paintings around a palm-filled winter garden.',
      tip: 'Free entry on the last Wednesday of each month.',
      featured: true,
      wikiTitle: 'Ny Carlsberg Glyptotek',
      mapQuery: 'Ny Carlsberg Glyptotek, Copenhagen',
    },
    {
      name: 'Rådhusbiblioteket',
      category: 'landmarks',
      area: 'Rådhuspladsen',
      description:
        'Copenhagen’s central public library, sitting in the City Hall complex on the main square.',
      mapQuery: 'Københavns Hovedbibliotek, Copenhagen',
    },
    {
      name: 'Danish Design Centre',
      category: 'landmarks',
      area: 'Havneholmen',
      description:
        'Denmark’s national design organisation, housed in the harbourfront BLOX building alongside the Danish Architecture Centre’s exhibitions.',
      mapQuery: 'BLOX, Danish Architecture Center, Copenhagen',
    },
    {
      name: 'Natural History Museum of Denmark',
      category: 'landmarks',
      area: 'Botanical Garden',
      description:
        'The national museum of natural history — zoology, geology and botany collections — located in and around the University of Copenhagen Botanical Garden.',
      tip: 'Pair it with the Palm House next door.',
      wikiTitle: 'Natural History Museum of Denmark',
      mapQuery: 'Natural History Museum of Denmark, Copenhagen',
    },

    // ---- Outdoors & Views ----
    {
      name: 'The Circle Bridge (Cirkelbroen)',
      category: 'outdoors',
      area: 'Christianshavn Canal',
      description:
        'A pedestrian bridge by artist Olafur Eliasson made of five circular platforms topped with ship masts, spanning the Christianshavn canal since 2015.',
      mapQuery: 'Cirkelbroen, Copenhagen',
    },
    {
      name: 'The Palm House (Palmehuset)',
      category: 'outdoors',
      area: 'Botanical Garden',
      description:
        'A cast-iron and glass palm house from 1874 in the Botanical Garden, with a spiral staircase leading to a walkway through the treetops.',
      tip: 'Free entry to the garden; small fee for the Palm House.',
      wikiTitle: 'University of Copenhagen Botanical Garden',
      mapQuery: 'Palm House, Botanical Garden, Copenhagen',
    },
    {
      name: 'CopenHill (Amager Bakke)',
      category: 'outdoors',
      area: 'Amager',
      description:
        'A waste-to-energy power plant topped with an artificial ski slope, hiking trails and one of the world’s tallest climbing walls — plus a rooftop café with city views.',
      tip: 'Even without skiing, the walk to the roof is worth it for the view.',
      featured: true,
      wikiTitle: 'CopenHill',
    },

    // ---- Food & Drink ----
    {
      name: 'Ibens Smørrebrød',
      category: 'food',
      area: 'Store Kongensgade',
      description:
        'One of Denmark’s smallest restaurants — about 15 seats — serving traditional open-faced smørrebrød sandwiches, a short walk from Amalienborg.',
      tip: 'Book ahead — it fills up fast, especially on weekends.',
      featured: true,
      mapQuery: 'Ibens Smørrebrød, Store Kongensgade 116A, Copenhagen',
    },
    {
      name: "It's Burger",
      category: 'food',
      area: 'Gothersgade',
      description:
        'A no-frills burger joint on Gothersgade near Nørreport — cheap, quick and good.',
      mapQuery: "It's Burger, Gothersgade 40, Copenhagen",
    },
    {
      name: 'Banana Joe',
      category: 'food',
      area: 'Nørrebro',
      description:
        'A tiny local fast-food spot on Elmegade in Nørrebro that has been serving cheap eats since 2001.',
      mapQuery: 'Banana Joe, Elmegade 18, Copenhagen',
    },
    {
      name: 'Madglad',
      category: 'food',
      area: 'Vesterbro',
      description:
        'A community kitchen (folkekøkken) on Vesterbro serving a homemade dish of the day with salads and bread for around 85 kr — one of the best-value dinners in the city.',
      tip: 'Dinner is communal, 16:30–21:00 — sit at the big tables.',
      featured: true,
      mapQuery: 'Madglad, Eskildsgade 13, Copenhagen',
    },
    {
      name: 'Folkehuset Absalon',
      category: 'food',
      area: 'Vesterbro',
      description:
        'A community house in a former church where locals and visitors eat together at long tables — nightly communal dinners (fællesspisning) at 18:00 for about 75–100 kr.',
      tip: 'Buy a dinner ticket online in advance; arrive before 17:45.',
      featured: true,
      mapQuery: 'Folkehuset Absalon, Sønder Boulevard 73, Copenhagen',
    },

    // ---- Misc ----
    {
      name: 'Next House Copenhagen',
      category: 'misc',
      area: 'Near Central Station',
      description:
        'A large, modern budget hostel a few minutes’ walk from København H — where I stayed on this trip.',
      tip: 'Where I stayed — good value and a great base for the center.',
      featured: true,
      mapQuery: 'Next House Copenhagen hostel',
    },
  ],
};
