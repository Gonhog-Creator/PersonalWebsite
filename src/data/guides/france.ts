import { CountryGuideData } from './types';

export const franceGuide: CountryGuideData = {
  country: 'France',
  slug: 'france',
  title: 'France',
  subtitle: 'Paris & Strasbourg',
  heroImage: '/img/France/france_panorama (6).jpg',
  heroAlt: 'Paris panorama',
  mapContext: 'France',

  intro: [
    'This guide covers the two French cities I spent real time in: Paris — where my saved spots cluster around the Invalides and Montmartre — and Strasbourg, the half-French, half-German cathedral city in Alsace.',
    'The TGV connects Paris–Strasbourg in under two hours from Gare de l\'Est, so Strasbourg works as an easy add-on to a Paris stay.',
  ],

  gettingThere: [
    {
      title: 'Paris is the hub',
      text: 'CDG and Orly both connect to the center by RER/express bus — the Paris Visite or a Navigo card covers all metros and buses.',
    },
    {
      title: 'Strasbourg by TGV from Gare de l\'Est',
      text: 'High-speed trains run roughly hourly and take about 1h45 — Strasbourg’s old town is a 10-minute walk from the station.',
    },
    {
      title: 'Both cities are walk-first',
      text: 'Paris needs the metro between neighborhoods; Strasbourg’s entire center is inside a loop of canals and is fully walkable.',
    },
  ],

  routes: [{
    title: 'Paris Walking Route',
    description:
      'The Left Bank classics — start at the Invalides, cross to the Tuileries and Louvre, end at the Île de la Cité as the light drops.',
    stops: [
      { place: 'Hôtel des Invalides' },
      { place: 'Musée Rodin, Paris' },
      { place: 'Musée d\'Orsay' },
      { place: 'Tuileries Garden' },
      { place: 'Louvre Museum' },
      { place: 'Pont Neuf' },
      { place: 'Notre-Dame Cathedral' },
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
      name: 'Hôtel des Invalides & Musée de l\'Armée',
      category: 'landmarks',
      area: 'Paris 7e',
      description:
        'Louis XIV’s 1670s veterans’ hospital crowned by the golden Dôme — Napoleon’s tomb lies beneath it, and the Army Museum is one of the world’s largest.',
      tip: 'My saved pin was right at this entrance — the Rodin Museum is a 5-minute walk from here.',
      featured: true,
      wikiTitle: 'Les Invalides',
      mapQuery: '5B Boulevard des Invalides, Paris',
    },
    {
      name: 'Montmartre & Sacré-Cœur',
      category: 'landmarks',
      area: 'Paris 18e',
      description:
        'The hilltop village crowned by the white domes of Sacré-Cœur — artists’ square at Place du Tertre and sweeping city views from the dome.',
      tip: 'I pinned the esplanade approach — climb the dome for the panorama, skip the funicular queue.',
      featured: true,
      wikiTitle: 'Sacré-Cœur, Paris',
      mapQuery: 'Esplanade Nathalie Sarraute, Paris 18e',
    },
    {
      name: 'Musée Rodin',
      category: 'landmarks',
      area: 'Paris 7e',
      description:
        'Rodin’s former workshop and mansion — The Thinker sits in the rose garden along with the Burghers of Calais, one of Paris’s most peaceful museums.',
      wikiTitle: 'Musée Rodin',
      mapQuery: 'Musée Rodin, Paris',
    },
    {
      name: 'Strasbourg Cathedral',
      category: 'landmarks',
      area: 'Strasbourg',
      description:
        'The single-spired pink sandstone Gothic masterpiece — for 200 years the tallest building in the world, with an astronomical clock inside.',
      featured: true,
      wikiTitle: 'Strasbourg Cathedral',
      mapQuery: 'Strasbourg Cathedral',
    },
    {
      name: 'Petite France',
      category: 'landmarks',
      area: 'Strasbourg',
      description:
        'The canals-and-timbered-houses quarter where millers and tanners once worked — covered bridges and the Vauban dam at its edge.',
      tip: 'My saved pin was on Rue des Veaux right in this quarter.',
      featured: true,
      mapQuery: 'Rue des Veaux, Strasbourg',
    },
    {
      name: 'Louvre Museum',
      category: 'landmarks',
      area: 'Paris 1er',
      description:
        'The world’s most-visited museum — the royal palace turned museum holding the Mona Lisa, Winged Victory and 35,000 objects.',
      wikiTitle: 'Louvre',
      mapQuery: 'Louvre Museum, Paris',
    },
    {
      name: 'Eiffel Tower',
      category: 'landmarks',
      area: 'Paris 7e',
      description:
        'Gustave Eiffel’s 1889 iron lattice — 330 m tall with three levels; the best view of it is from the Trocadéro esplanade across the river.',
      wikiTitle: 'Eiffel Tower',
      mapQuery: 'Eiffel Tower, Paris',
    },
    {
      name: 'Tuileries Garden',
      category: 'outdoors',
      area: 'Paris 1er',
      description:
        'The formal gardens linking the Louvre to the Place de la Concorde — André Le Nôtre’s central allée, fountains and the two game-filled basins.',
      wikiTitle: 'Tuileries Garden',
      mapQuery: 'Tuileries Garden, Paris',
    },
    {
      name: 'Seine cruise or walk',
      category: 'outdoors',
      area: 'Paris',
      description:
        'The riverside quays are pedestrianized between the Louvre and Notre-Dame — a walk along the banks passes the bouquinistes’ green book stalls.',
      mapQuery: 'Bateaux-Mouches, Paris',
    },
    {
      name: 'Croissant & café culture',
      category: 'food',
      area: 'Paris',
      description:
        'The morning ritual — a counter espresso and croissant at any corner boulangerie. Best croissants: Du Pain et des Idées or a warm baguette sandwich anywhere.',
      mapQuery: 'Du Pain et des Idées, Paris',
    },
    {
      name: 'Winstubs (Alsatian taverns)',
      category: 'food',
      area: 'Strasbourg',
      description:
        'The traditional wine taverns serving tarte flambée (flammekueche), choucroute and local Riesling — look for the wooden-beamed ones near the cathedral.',
      mapQuery: 'Winstub S\'Kaechele, Strasbourg',
    },
    {
      name: 'Île de la Cité',
      category: 'misc',
      area: 'Paris',
      description:
        'The island where Paris began — Notre-Dame, Sainte-Chapelle’s stained glass and the Conciergerie where Marie Antoinette was held.',
      wikiTitle: 'Île de la Cité',
      mapQuery: 'Île de la Cité, Paris',
    },
  ],
};
