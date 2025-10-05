import { AstroPhoto } from "@/types/astro";

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper function to get image path
const getImagePath = (id: number) => `/img/Astro/astro-${id}.jpg`;

export const astroPhotos: AstroPhoto[] = [
  {
    id: 1,
    title: 'Milky Way Over Cacti',
    location: 'Iruya, Argentina',
    date: formatDate('2025-01-15'),
    src: getImagePath(1),
    alt: 'Milky Way Over Cacti - Captured in Iruya, Argentina'
  },
  {
    id: 2,
    title: 'Milky Way Over Mountain',
    location: 'Iruya, Argentina',
    date: formatDate('2025-02-20'),
    src: getImagePath(2),
    alt: 'Milky Way Over Mountain - Captured in Iruya, Argentina'
  },
  {
    id: 3,
    title: 'Milky Way Over Cementary',
    location: 'Iruya, Argentina',
    date: formatDate('2025-03-10'),
    src: getImagePath(3),
    alt: 'Milky Way Over Cementary - Captured in Iruya, Argentina'
  },
  {
    id: 4,
    title: 'Milky Way Over Forest',
    location: 'Bald Head Island, NC',
    date: formatDate('2025-04-05'),
    src: getImagePath(4),
    alt: 'Milky Way Over Forest - Captured in Bald Head Island, NC'
  },
  {
    id: 5,
    title: 'Milky Way',
    location: 'Bald Head Island, NC',
    date: formatDate('2025-05-18'),
    src: getImagePath(5),
    alt: 'Milky Way - Captured in Bald Head Island, NC'
  },
    {
    id: 6,
    title: 'Milky Way Over Lost Lake',
    location: 'Lost Lake, Oregon',
    date: formatDate('2024-06-15'),
    src: getImagePath(6),
    alt: 'Milky Way Over Lost Lake - Captured in Lost Lake, Oregon'
  },
  {
    id: 7,
    title: 'Crooked Tree With Stars',
    location: 'Death Valley, California',
    date: formatDate('2024-07-22'),
    src: getImagePath(7),
    alt: 'Crooked Tree With Stars - Captured in Death Valley, California'
  },
  {
    id: 8,
    title: 'Milky Way With Fir Tree',
    location: 'Fraser Island, Australia',
    date: formatDate('2024-08-10'),
    src: getImagePath(8),
    alt: 'Milky Way With Fir Tree - Captured in Fraser Island, Australia'
  },
  {
    id: 9,
    title: 'Milky Way Over Mountain Range',
    location: 'Grindelwald Summit, Switzerland',
    date: formatDate('2024-09-05'),
    src: getImagePath(9),
    alt: 'Milky Way Over Mountain Range - Captured in Grindelwald Summit, Switzerland'
  },
  {
    id: 10,
    title: 'Milky Way Over Coastline',
    location: 'Mt. Rainier, Oregon',
    date: formatDate('2024-10-12'),
    src: getImagePath(10),
    alt: 'Milky Way Over Coastline - Captured in Mt. Rainier, Oregon'
  },
  {
    id: 11,
    title: 'Milky Way Over Marsh',
    location: 'Whitsunday Islands, Australia',
    date: formatDate('2024-11-18'),
    src: getImagePath(11),
    alt: 'Milky Way Over Marsh - Captured in Whitsunday Islands, Australia'
  },
  {
    id: 12,
    title: 'Starry Night Over Forest',
    location: 'Forest, Argentina',
    date: formatDate('2024-12-03'),
    src: getImagePath(12),
    alt: 'Starry Night Over Forest - Captured in Forest, Argentina'
  },
  {
    id: 13,
    title: 'Coastal Stargazing',
    location: 'Coastline, Argentina',
    date: formatDate('2025-01-20'),
    src: getImagePath(13),
    alt: 'Coastal Stargazing - Captured in Coastline, Argentina'
  },
  {
    id: 14,
    title: 'Mountain and Stars',
    location: 'Cachi, Argentina',
    date: formatDate('2025-02-15'),
    src: getImagePath(14),
    alt: 'Mountain and Stars - Captured in Cachi, Argentina'
  },
  {
    id: 15,
    title: 'Desert Night Sky',
    location: 'Atacama Desert, Chile',
    date: formatDate('2025-03-08'),
    src: getImagePath(15),
    alt: 'Desert Night Sky - Captured in Atacama Desert, Chile'
  },
  {
    id: 16,
    title: 'Alpine Stars',
    location: 'Swiss Alps, Switzerland',
    date: formatDate('2025-04-22'),
    src: getImagePath(16),
    alt: 'Alpine Stars - Captured in Swiss Alps, Switzerland'
  },
  {
    id: 17,
    title: 'Beachside Constellations',
    location: 'Whitsunday Islands, Australia',
    date: formatDate('2025-05-30'),
    src: getImagePath(17),
    alt: 'Beachside Constellations - Captured in Whitsunday Islands, Australia'
  },
  {
    id: 18,
    title: 'Mountain Lake Reflection',
    location: 'Patagonia, Argentina',
    date: formatDate('2025-06-14'),
    src: getImagePath(18),
    alt: 'Mountain Lake Reflection - Captured in Patagonia, Argentina'
  },
  {
    id: 19,
    title: 'Desert Dunes at Night',
    location: 'Atacama Desert, Chile',
    date: formatDate('2025-07-07'),
    src: getImagePath(19),
    alt: 'Desert Dunes at Night - Captured in Atacama Desert, Chile'
  },
  {
    id: 20,
    title: 'Alpine Aurora',
    location: 'Swiss Alps, Switzerland',
    date: formatDate('2025-08-12'),
    src: getImagePath(20),
    alt: 'Alpine Aurora - Captured in Swiss Alps, Switzerland'
  },
  {
    id: 21,
    title: 'Tropical Night Sky',
    location: 'Whitsunday Islands, Australia',
    date: formatDate('2025-09-25'),
    src: getImagePath(21),
    alt: 'Tropical Night Sky - Captured in Whitsunday Islands, Australia'
  },
  {
    id: 22,
    title: 'Mountain Peak Stars',
    location: 'Patagonia, Argentina',
    date: formatDate('2025-10-18'),
    src: getImagePath(22),
    alt: 'Mountain Peak Stars - Captured in Patagonia, Argentina'
  },
  {
    id: 23,
    title: 'Desert Milky Way',
    location: 'Atacama Desert, Chile',
    date: formatDate('2025-11-05'),
    src: getImagePath(23),
    alt: 'Desert Milky Way - Captured in Atacama Desert, Chile'
  },
  {
    id: 24,
    title: 'Alpine Lake Reflections',
    location: 'Swiss Alps, Switzerland',
    date: formatDate('2025-12-20'),
    src: getImagePath(24),
    alt: 'Alpine Lake Reflections - Captured in Swiss Alps, Switzerland'
  },
  {
    id: 25,
    title: 'Beach Stargazing',
    location: 'Whitsunday Islands, Australia',
    date: formatDate('2026-01-15'),
    src: getImagePath(25),
    alt: 'Beach Stargazing - Captured in Whitsunday Islands, Australia'
  },
  {
    id: 26,
    title: 'Mountain Valley Stars',
    location: 'Patagonia, Argentina',
    date: formatDate('2026-02-28'),
    src: getImagePath(26),
    alt: 'Mountain Valley Stars - Captured in Patagonia, Argentina'
  }
];
