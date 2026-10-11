import { CountryGuideData } from './types';

export const germanyGuide: CountryGuideData = {
  country: 'Germany',
  slug: 'germany',
  title: 'Germany',
  subtitle: 'Berlin, Munich & the Bavarian Alps',
  heroImage: '/img/Germany/germany_panorama (2).jpg',
  heroAlt: 'Germany panorama',
  mapContext: 'Germany',

  intro: [
    'Germany is a multi-city country — this guide covers the classic triangle: Berlin for history, Munich for beer halls and English Garden, and the Bavarian Alps south of Munich for castles and mountain views.',
    'Deutsche Bahn trains connect everything — the Berlin–Munich ICE runs every hour and takes about 4 hours through the middle of the country.',
  ],

  gettingThere: [
    {
      title: 'Berlin (BER) or Munich (MUC) as entry',
      text: 'Both airports connect to their cities by S-Bahn in ~40 minutes. Flying into one and out of the other avoids backtracking.',
    },
    {
      title: 'Neuschwanstein is a Munich day trip',
      text: 'Regional train to Füssen (~2h) then a short bus to the ticket center — book castle entry online, time slots sell out.',
    },
    {
      title: 'Deutschland-Ticket for regionals',
      text: 'The €58/month ticket covers all regional trains, trams and buses nationwide — worth it if you ride more than a couple of regional legs.',
    },
  ],

  routes: [{
    title: 'Berlin Walking Route',
    description:
      'The 20th-century history loop — Reichstag and Brandenburg Gate, the Holocaust memorial, then east along the former Wall line.',
    stops: [
      { place: 'Reichstag Building, Berlin' },
      { place: 'Brandenburg Gate' },
      { place: 'Memorial to the Murdered Jews of Europe' },
      { place: 'Checkpoint Charlie' },
      { place: 'East Side Gallery' },
      { place: 'Museum Island, Berlin' },
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
      name: 'Brandenburg Gate & Reichstag',
      category: 'landmarks',
      area: 'Berlin',
      description:
        'The 18th-century neoclassical gate that became the symbol of German reunification, with the parliament’s glass dome next door (book the free dome visit ahead).',
      featured: true,
      wikiTitle: 'Brandenburg Gate',
      mapQuery: 'Brandenburg Gate, Berlin',
    },
    {
      name: 'East Side Gallery',
      category: 'landmarks',
      area: 'Berlin',
      description:
        'A 1.3 km preserved stretch of the Berlin Wall covered in murals — the longest open-air gallery in the world along the Spree.',
      wikiTitle: 'East Side Gallery',
      mapQuery: 'East Side Gallery, Berlin',
    },
    {
      name: 'Memorial to the Murdered Jews of Europe',
      category: 'landmarks',
      area: 'Berlin',
      description:
        '2,711 concrete stelae in a field near the Brandenburg Gate — the central Holocaust memorial, designed by Peter Eisenman (2005).',
      wikiTitle: 'Memorial to the Murdered Jews of Europe',
      mapQuery: 'Memorial to the Murdered Jews of Europe, Berlin',
    },
    {
      name: 'Museum Island',
      category: 'landmarks',
      area: 'Berlin',
      description:
        'Five world-class museums on one Spree island — the Pergamon’s Ishtar Gate and the Neues Museum’s bust of Nefertiti are the headliners.',
      wikiTitle: 'Museum Island',
      mapQuery: 'Museum Island, Berlin',
    },
    {
      name: 'Marienplatz & Neues Rathaus',
      category: 'landmarks',
      area: 'Munich',
      description:
        'Munich’s central square since 1158 — the Gothic New Town Hall plays its famous Glockenspiel daily at 11am and noon.',
      wikiTitle: 'Marienplatz',
      mapQuery: 'Marienplatz, Munich',
    },
    {
      name: 'Neuschwanstein Castle',
      category: 'landmarks',
      area: 'Schwangau, Bavaria',
      description:
        'Ludwig II’s 1869 fairy-tale castle on a ridge above the Pöllat gorge — the direct inspiration for the Disney castle. Views from Marienbrücke bridge.',
      featured: true,
      wikiTitle: 'Neuschwanstein Castle',
      mapQuery: 'Neuschwanstein Castle, Bavaria',
    },
    {
      name: 'English Garden',
      category: 'outdoors',
      area: 'Munich',
      description:
        'One of the world’s largest urban parks — a river where surfers ride a standing wave at the Eisbach, beer garden at the Chinese Tower.',
      tip: 'Watch the Eisbach surfers near the park entrance — completely surreal for a city park.',
      featured: true,
      wikiTitle: 'Englischer Garten',
      mapQuery: 'Eisbachwelle, Munich',
    },
    {
      name: 'Zugspitze',
      category: 'outdoors',
      area: 'Garmisch-Partenkirchen',
      description:
        'Germany’s highest peak at 2,962 m — cog railway or cable car to a summit terrace spanning the border with Austria.',
      mapQuery: 'Zugspitze, Bavaria',
    },
    {
      name: 'Tempelhofer Feld',
      category: 'outdoors',
      area: 'Berlin',
      description:
        'The former airport turned public park — bike or skate down the actual runways where the Berlin Airlift landed in 1948.',
      mapQuery: 'Tempelhofer Feld, Berlin',
    },
    {
      name: 'Hofbräuhaus',
      category: 'food',
      area: 'Munich',
      description:
        'The 1589 state beer hall — oompah bands, liter steins and shared tables under vaulted ceilings. Touristy but the original.',
      mapQuery: 'Hofbräuhaus, Munich',
    },
    {
      name: 'Viktualienmarkt',
      category: 'food',
      area: 'Munich',
      description:
        'Munich’s permanent food market since 1807 — stalls, a beer garden and the maypole, right behind Marienplatz.',
      mapQuery: 'Viktualienmarkt, Munich',
    },
    {
      name: 'Currywurst & döner kebab',
      category: 'food',
      area: 'Berlin',
      description:
        'Berlin’s two street foods — currywurst (invented here in 1949) and the döner kebab perfected by Turkish immigrants at spots like Mustafa’s Gemüse Kebap.',
      mapQuery: 'Curry 36, Berlin',
    },
    {
      name: 'Berlin techno clubs',
      category: 'misc',
      area: 'Berlin',
      description:
        'Berghain in a former power station is the world’s most famous techno club; Tresor and ://about blank carry the same tradition. Door policies are strict — go late, dress low-key.',
      mapQuery: 'Berghain, Berlin',
    },
  ],
};
