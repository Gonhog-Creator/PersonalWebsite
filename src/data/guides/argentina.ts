import { CountryGuideData } from './types';

export const argentinaGuide: CountryGuideData = {
  country: 'Argentina',
  slug: 'argentina',
  title: 'Argentina',
  subtitle: 'Buenos Aires, Patagonia & the Andean north',
  heroImage: '/img/Argentina/argentina_panorama (10).jpg',
  heroAlt: 'Argentina panorama',
  mapContext: 'Argentina',

  intro: [
    'Argentina is three trips in one country — the grand boulevards and steak houses of Buenos Aires, the glaciers and granite spires of Patagonia in the south, and the desert valleys and salt flats of the Andean north. This guide splits them into three sections.',
    'Distances are enormous — BA to Patagonia is a 3-hour flight, and the north is another 2. The domestic flight network (Aerolíneas Argentinas) is the backbone of any trip covering more than one region.',
  ],

  gettingThere: [
    {
      title: 'Fly into Buenos Aires (EZE)',
      text: 'Ministro Pistarini International is the hub for the whole country. Take a remis or Uber into the center (~45 min) — note the domestic airport Aeroparque (AEP) is separate and closer.',
    },
    {
      title: 'South: fly to El Calafate or Bariloche',
      text: 'El Calafate (FTE) is the base for Perito Moreno and the bus to El Chaltén for Fitz Roy. Bariloche covers the lakes district. Both ~3h from BA.',
    },
    {
      title: 'North: fly to Salta or Puerto Iguazú',
      text: 'Salta (SLA) is the base for the Quebrada de Humahuaca and Cafayate wine valley — rent a car. Puerto Iguazú (IGR) drops you at the falls.',
    },
  ],

  routes: [
    {
      title: 'Buenos Aires',
      description:
        'A full-day walk through the center and south — Plaza de Mayo and the Casa Rosada, the Teatro Colón, the obelisk on 9 de Julio, then south through San Telmo to La Boca, finishing at the Puerto Madero docks.',
      stops: [
        { place: 'Plaza de Mayo & Casa Rosada' },
        { place: 'Teatro Colón' },
        { place: 'Obelisco de Buenos Aires' },
        { place: 'Recoleta Cemetery' },
        { place: 'San Telmo Market' },
        { place: 'Caminito, La Boca' },
        { place: 'Puerto Madero & Puente de la Mujer' },
      ],
    },
    {
      title: 'The South — Patagonia',
      description:
        'A driving itinerary through southern Patagonia — fly into El Calafate for the Perito Moreno glacier, then bus up to El Chaltén for the Fitz Roy and Cerro Torre trailheads. Ushuaia is a separate flight if you add Tierra del Fuego.',
      mode: 'driving',
      stops: [
        { place: 'El Calafate' },
        { place: 'Perito Moreno Glacier' },
        { place: 'El Chaltén' },
        { place: 'Fitz Roy — Laguna de los Tres trailhead', query: 'Laguna de los Tres trailhead, El Chaltén, Argentina' },
        { place: 'Cerro Torre — Laguna Torre trailhead', query: 'Laguna Torre trailhead, El Chaltén, Argentina' },
        { place: 'Ushuaia, Tierra del Fuego' },
      ],
    },
    {
      title: 'The North — Salta & Iguazú',
      description:
        'Two separate flights from BA. Around Salta: the wine road to Cafayate and the Quebrada de Humahuaca villages (Purmamarca, Tilcara, Humahuaca). Then Puerto Iguazú for the falls — both the Argentine walkways and the Brazilian panorama.',
      mode: 'driving',
      stops: [
        { place: 'Salta' },
        { place: 'Cafayate' },
        { place: 'Quebrada de las Conchas' },
        { place: 'Purmamarca & Cerro de los Siete Colores' },
        { place: 'Salinas Grandes' },
        { place: 'Quebrada de Humahuaca' },
        { place: 'Puerto Iguazú' },
        { place: 'Iguazú Falls — Garganta del Diablo', query: 'Garganta del Diablo, Iguazú Falls' },
      ],
    },
  ],

  categories: [
    { id: 'landmarks', label: 'Landmarks & History', icon: 'mdi:bank' },
    { id: 'outdoors', label: 'Outdoors & Views', icon: 'mdi:tree' },
    { id: 'food', label: 'Food & Drink', icon: 'mdi:silverware-fork-knife' },
    { id: 'misc', label: 'Misc', icon: 'mdi:dots-horizontal-circle-outline' },
  ],

  places: [
    // ---- Buenos Aires ----
    {
      name: 'Recoleta Cemetery',
      category: 'landmarks',
      area: 'Buenos Aires — Recoleta',
      description:
        'A city of marble mausoleums housing Argentina\'s greats — Evita Perón\'s family vault is the most-visited grave. Free entry, tours in English.',
      wikiTitle: 'La Recoleta Cemetery',
      mapQuery: 'Recoleta Cemetery, Buenos Aires',
    },
    {
      name: 'Teatro Colón',
      category: 'landmarks',
      area: 'Buenos Aires — Tribunales',
      description:
        'One of the world\'s great opera houses — a 1908 monument with 2,500 seats and acoustics ranked top-five globally. Hourly guided tours.',
      wikiTitle: 'Teatro Colón',
      mapQuery: 'Teatro Colón, Buenos Aires',
    },
    {
      name: 'Plaza de Mayo & Casa Rosada',
      category: 'landmarks',
      area: 'Buenos Aires — Microcentro',
      description:
        'The political heart of the country — the pink presidential palace (Evita\'s balcony), the cathedral and the Mothers of Plaza de Mayo\'s painted kerchiefs.',
      mapQuery: 'Plaza de Mayo, Buenos Aires',
    },
    {
      name: 'Caminito & La Boca',
      category: 'landmarks',
      area: 'Buenos Aires — La Boca',
      description:
        'The painted tin shanty street that defines postcard BA — tango dancers in the street and Boca Juniors\' La Bombonera stadium a few blocks away.',
      tip: 'Go in the morning — the neighborhood is rough outside the tourist blocks.',
      mapQuery: 'Caminito, Buenos Aires',
    },
    {
      name: 'San Telmo',
      category: 'landmarks',
      area: 'Buenos Aires — San Telmo',
      description:
        'The oldest barrio — cobblestone antique shops, the covered 1897 market and the Sunday Defensa street fair with tango in the plazas.',
      wikiTitle: 'San Telmo, Buenos Aires',
      mapQuery: 'San Telmo Market, Buenos Aires',
    },
    {
      name: 'Puerto Madero & Puente de la Mujer',
      category: 'landmarks',
      area: 'Buenos Aires — Waterfront',
      description:
        'The converted dockland warehouses — a clean riverside walk under Calatrava\'s "Woman\'s Bridge" and a boardwalk of steakhouses.',
      mapQuery: 'Puerto Madero, Buenos Aires',
    },
    {
      name: 'Tigre & the Paraná Delta',
      category: 'outdoors',
      area: 'Buenos Aires — Tigre',
      description:
        'The river delta an hour north by train — boat rides through stilt-house islands, the Puerto de Frutos market and rowing clubs on the water.',
      tip: 'My saved pin — the boat tour through the delta channels is the move, not the amusement park.',
      featured: true,
      wikiTitle: 'Tigre, Buenos Aires',
      mapQuery: 'Tigre, Buenos Aires',
    },
    {
      name: 'Palermo & Bosques de Palermo',
      category: 'outdoors',
      area: 'Buenos Aires — Palermo',
      description:
        'The park-and-bar district — the Rosedal rose garden, Japanese garden, planetarium and the endless café strip of Palermo Soho.',
      mapQuery: 'Bosques de Palermo, Buenos Aires',
    },
    {
      name: 'Asado at a proper parrilla',
      category: 'food',
      area: 'Buenos Aires',
      description:
        'The national ritual — Don Julio in Palermo is the famous splurge (book weeks ahead); El Pobre Luis and Parrilla Peña are the neighborhood classics.',
      tip: 'Order provoleta and morcilla first, then the bife de chorizo — and ask for it jugoso (medium rare).',
      featured: true,
      mapQuery: 'Don Julio Parrilla, Buenos Aires',
    },
    // ---- The South ----
    {
      name: 'Perito Moreno Glacier',
      category: 'outdoors',
      area: 'The South — Los Glaciares NP',
      description:
        'The 30 km-long advancing glacier an hour from El Calafate — walkways face the 60 m ice wall, boat rides get closer, and it calves dramatically.',
      featured: true,
      wikiTitle: 'Perito Moreno Glacier',
      mapQuery: 'Perito Moreno Glacier, Argentina',
    },
    {
      name: 'El Chaltén & the Fitz Roy massif',
      category: 'outdoors',
      area: 'The South — El Chaltén',
      description:
        'Argentina\'s trekking capital — the classic day hikes (Laguna de los Tres for Fitz Roy, Laguna Torre for Cerro Torre) leave straight from town.',
      tip: 'My pinned trail — the last climb to Laguna de los Tres is brutal but the granite-spire payoff is the best view in Patagonia.',
      featured: true,
      wikiTitle: 'El Chaltén',
      mapQuery: 'El Chaltén, Argentina',
    },
    {
      name: 'Ushuaia & the Beagle Channel',
      category: 'outdoors',
      area: 'The South — Tierra del Fuego',
      description:
        'The "end of the world" city — Beagle Channel boat trips to penguin colonies, the End of the World train and the gateway to Antarctica.',
      wikiTitle: 'Ushuaia',
      mapQuery: 'Ushuaia, Argentina',
    },
    {
      name: 'Bariloche & the Seven Lakes',
      category: 'outdoors',
      area: 'The South — Lakes District',
      description:
        'The alpine-style lake town — the Ruta de los Siete Lagos road to San Martín de los Andes, Cerro Catedral lifts and Argentina\'s chocolate capital.',
      wikiTitle: 'Bariloche',
      mapQuery: 'San Carlos de Bariloche, Argentina',
    },
    // ---- The North ----
    {
      name: 'Iguazú Falls',
      category: 'outdoors',
      area: 'The North — Misiones',
      description:
        '275 separate falls across a 2.7 km basalt rim — the Argentine side gets you onto the walkways at the Devil\'s Throat edge; the Brazilian side gives the postcard panorama.',
      tip: 'Both sides in one day if you start early — bring passport for the Brazil border crossing.',
      featured: true,
      wikiTitle: 'Iguazu Falls',
      mapQuery: 'Iguazu Falls, Argentina',
    },
    {
      name: 'Salta "la Linda"',
      category: 'landmarks',
      area: 'The North — Salta',
      description:
        'The colonial base city — Plaza 9 de Julio\'s cafés, the MAAM museum\'s Inca mummies and the Teleférico over the hills at sunset.',
      mapQuery: 'Plaza 9 de Julio, Salta',
    },
    {
      name: 'Cafayate & Quebrada de las Conchas',
      category: 'outdoors',
      area: 'The North — Cafayate',
      description:
        'The high-altitude wine valley — red-rock amphitheater and "Devil\'s Throat" formations on the road south, then Torrontés tastings in town.',
      tip: 'The Ruta 68 drive is half the experience — stop at every mirador.',
      featured: true,
      mapQuery: 'Cafayate, Argentina',
    },
    {
      name: 'Quebrada de Humahuaca',
      category: 'outdoors',
      area: 'The North — Jujuy',
      description:
        'The UNESCO rainbow canyon — Purmamarca\'s Hill of Seven Colors, Tilcara\'s Inca fortress and the 4,200 m Salinas Grandes salt flats en route.',
      featured: true,
      wikiTitle: 'Quebrada de Humahuaca',
      mapQuery: 'Purmamarca, Argentina',
    },
    // ---- Misc ----
    {
      name: 'Tango in a milonga',
      category: 'misc',
      area: 'Buenos Aires',
      description:
        'Skip the dinner-show version — a real milonga (social dance hall) in Palermo or Almagro has beginner lessons at 8pm and locals dancing until 2am.',
      mapQuery: 'La Viruta, Buenos Aires',
    },
    {
      name: 'Café culture & helado',
      category: 'food',
      area: 'Buenos Aires',
      description:
        'Café Tortoni (1858) is the famous one; Lucciano\'s and Rapa Nui are the helado debate — dulce de leche granizado is the flavor to order.',
      mapQuery: 'Café Tortoni, Buenos Aires',
    },
  ],
};
