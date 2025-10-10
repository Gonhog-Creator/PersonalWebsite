import { DSOImage, DSOType } from "@/types/astro";

const constellations = [
  'Orion', 'Andromeda', 'Ursa Major', 'Sagittarius', 'Lyra', 
  'Cygnus', 'Pegasus', 'Perseus', 'Cassiopeia', 'Hercules',
  'Scorpius', 'Taurus', 'Gemini', 'Canis Major', 'Virgo',
  'Leo', 'Libra', 'Aquila', 'Ophiuchus', 'Draco', 'Cepheus'
];

const telescopes = [
  'Seestar S50'
];

export const dsoImages: DSOImage[] = [
  {
    id: 'dso-1',
    title: 'Casper Ghost Nebula (M78)',
    date: '2024-12-02',
    shortDescription: 'A striking reflection nebula in Orion, M78 is the brightest in its group, illuminated by young, hot stars. Known for its ghostly appearance, it lies 1,350 light-years away and is part of the Orion B molecular cloud complex.',
    fullDescription: 'Messier 78 (also known as M78 or NGC 2068) is a reflection nebula in the constellation Orion. It is the brightest diffuse reflection nebula in a group that includes NGC 2064, NGC 2067, and NGC 2071, all part of the Orion B molecular cloud complex. Located approximately 1,350 light-years from Earth, M78 is visible in small telescopes as a hazy patch illuminated by two B-type stars, HD 38563 A and HD 38563 B, of 10th and 11th magnitude.',
    type: 'nebula',
    constellation: 'Orion',
    imageUrl: '/img/Astro/M78-12.1.24-784x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2 hours (784x10sec)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 78 },
      { type: 'ngc', number: 2068 }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-2',
    title: 'Bode\'s Galaxy (M81) & Cigar Galaxy (M82)',
    date: '2025-01-01',
    shortDescription: 'A stunning pair of interacting galaxies in Ursa Major: M81, a grand design spiral galaxy, and M82, a starburst galaxy with intense star formation, located about 12 million light-years away.',
    fullDescription: 'Bode\'s Galaxy (Messier 81 or M81) and the Cigar Galaxy (Messier 82 or M82) are a famous pair of interacting galaxies in the constellation Ursa Major, approximately 12 million light-years from Earth. M81 is a grand design spiral galaxy with well-defined spiral arms and a bright nucleus, while M82 is a starburst galaxy undergoing a period of intense star formation, likely triggered by gravitational interactions with M81 about 600 million years ago. The pair are the largest members of the M81 Group, one of the nearest galaxy groups to our Local Group. M82 is particularly notable for its high star formation rate, which is about 10 times that of our Milky Way, and its superwind of hot gas being ejected from its central regions, which makes it one of the most studied galaxies in the sky.',
    type: 'galaxy',
    constellation: 'Ursa Major',
    imageUrl: '/img/Astro/M81+M82-10.3.25-1073x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3 hours (1073x10s)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 81 },
      { type: 'messier', number: 82 },
      { type: 'ngc', number: 3031 },  // M81
      { type: 'ngc', number: 3034 },  // M82
      { type: 'other', number: 'UGC 5318' },  // M81
      { type: 'other', number: 'PGC 28630' },  // M82
      { type: 'other', number: 'Arp 16' },  // Interacting pair
      { type: 'other', number: 'KPG 218' }   // KPG catalog
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-3',
    title: 'AE Aurigae (Flaming Star Nebula)',
    date: '2024-02-20',
    shortDescription: 'AE Aurigae is a runaway star in the constellation Auriga, illuminating the Flaming Star Nebula (IC 405), a combination of emission and reflection nebula about 1,500 light-years away.',
    fullDescription: 'AE Aurigae is a runaway star in the constellation Auriga that is illuminating the Flaming Star Nebula (IC 405). This star is notable for its high proper motion across the sky, believed to have been ejected from the Orion Nebula region about 2.7 million years ago. The star is a hot O-type main-sequence star with a surface temperature of about 33,000 K, making it appear blue-white in color. The Flaming Star Nebula is a combination of an emission nebula (the red parts) and a reflection nebula (the blue parts), with the red glow coming from hydrogen gas ionized by AE Aurigae, while the blue areas are dust reflecting the star\'s light. The nebula is about 5 light-years across and is located approximately 1,500 light-years from Earth.',
    type: 'nebula',
    constellation: 'Auriga',
    imageUrl: '/img/Astro/AEAurigae-10.3.25-832x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2 hours (832x10sec)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'other', number: 'AE Aur' },
      { type: 'ic', number: 405 },
      { type: 'sharpless', number: 'Sh2-229' },
      { type: 'other', number: 'Caldwell 31' },
      { type: 'other', number: 'LBN 795' },
      { type: 'other', number: 'LBN 160.28+01.12' },
      { type: 'other', number: 'LBN 795.00+01.10' },
      { type: 'other', number: 'LDN 1553' },
      { type: 'other', number: 'Magakian 126' },
      { type: 'other', number: 'RAFGL 5165' },
      { type: 'other', number: 'VDB 31' },
      { type: 'other', number: 'W 1' },
      { type: 'other', number: 'H IV 29' },
      { type: 'other', number: 'H 5.28' },
      { type: 'other', number: 'Ced 55' },
      { type: 'other', number: 'LBN 160.28+01.12' },
      { type: 'other', number: 'LBN 795.00+01.10' },
      { type: 'other', number: 'LBN 160.28+01.12' },
      { type: 'other', number: 'LBN 795.00+01.10' },
      { type: 'other', number: 'LBN 160.28+01.12' },
      { type: 'other', number: 'LBN 795.00+01.10' },
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-4',
    title: 'Triangulum Galaxy (M33)',
    date: '2024-03-05',
    shortDescription: 'The Triangulum Galaxy is a spiral galaxy approximately 2.73 million light-years from Earth in the constellation Triangulum.',
    fullDescription: 'The Triangulum Galaxy (Messier 33, NGC 598) is a spiral galaxy approximately 2.73 million light-years from Earth in the constellation Triangulum. It is the third-largest member of the Local Group of galaxies, which includes the Milky Way, the Andromeda Galaxy and about 80 other smaller galaxies. It is one of the most distant permanent objects that can be viewed with the naked eye. The galaxy is the smallest spiral galaxy in the Local Group and is believed to be a satellite of the Andromeda Galaxy due to their interactions, velocities, and proximity to one another in the night sky.',
    type: 'galaxy',
    constellation: 'Triangulum',
    imageUrl: '/img/Astro/M33-10.3.25-794x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2 hours (794x10s)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 33 },
      { type: 'ngc', number: 598 },
      { type: 'other', number: 'PGC 5818' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-5',
    title: 'Thor\'s Helmet (NGC 2359)',
    date: '2024-12-31',
    shortDescription: 'A nebula in the constellation Canis Major, resembling the helmet of the Norse god Thor, sculpted by powerful stellar winds from a massive Wolf-Rayet star.',
    fullDescription: 'Thor\'s Helmet (NGC 2359) is an emission nebula in the constellation Canis Major. The nebula is approximately 15,000 light-years away and is about 30 light-years in size. The central star is the Wolf-Rayet star WR7, an extremely hot giant thought to be in a brief, pre-supernova stage of evolution. The nebula is shaped by the fast stellar wind from the Wolf-Rayet star colliding with the slower-moving gas that was ejected when the star was in its red giant phase. The nebula gets its distinctive shape from these powerful stellar winds, which have blown a large, nearly spherical bubble in the surrounding interstellar medium. The blue-green color in images comes from doubly ionized oxygen in the nebula, while the red comes from hydrogen alpha emission.',
    type: 'nebula',
    constellation: 'Canis Major',
    imageUrl: '/img/Astro/NGC2395-12.31.25-979x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2.7 hours (979x10s)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'ngc', number: 2359 },
      { type: 'other', number: 'Gum 4' },
      { type: 'other', number: 'RCW 5' },
      { type: 'sharpless', number: 'Sh2-298' },
      { type: 'other', number: 'LBN 1048' },
      { type: 'other', number: 'C 0711-136' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-6',
    title: 'Sombrero Galaxy (M104)',
    date: '2024-12-31',
    shortDescription: 'A stunning unbarred spiral galaxy in the constellation Virgo, known for its bright nucleus, large central bulge, and prominent dust lane in its disk that gives it a sombrero-like appearance.',
    fullDescription: 'The Sombrero Galaxy (Messier 104, NGC 4594) is a stunning unbarred spiral galaxy in the constellation Virgo, approximately 31.1 million light-years from Earth. It has a bright nucleus, an unusually large central bulge, and a prominent dust lane in its inclined disk that gives it a sombrero-like appearance when viewed from Earth. The galaxy has a supermassive black hole at its center, with a mass equivalent to 1 billion Suns. The Sombrero Galaxy has a diameter of approximately 50,000 light-years, about 30% the size of our Milky Way. It was discovered in 1781 by Pierre Méchain and later added to the Messier catalogue by Camille Flammarion in 1921.',
    type: 'galaxy',
    constellation: 'Virgo',
    imageUrl: '/img/Astro/M104-12.31.25-331x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1 hour (331x10s)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 104 },
      { type: 'ngc', number: 4594 },
      { type: 'other', number: 'UGC 293' },
      { type: 'other', number: 'PGC 042407' },
      { type: 'other', number: 'MCG -02-32-020' },
      { type: 'other', number: '1ES 1236-11.4' },
      { type: 'other', number: 'IRAS 12345-1121' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-7',
    title: 'Rosette Nebula (NGC 2237)',
    date: '2024-12-25',
    shortDescription: 'A large, circular H II region located near one end of a giant molecular cloud in the Monoceros region of the Milky Way Galaxy.',
    fullDescription: 'The Rosette Nebula (NGC 2237) is a large, circular H II region located near one end of a giant molecular cloud in the Monoceros region of the Milky Way Galaxy. The open cluster NGC 2244 is closely associated with the nebulosity, the stars of the cluster having been formed from the nebula\'s matter. The nebula has been noted to be having a shape suggestive of a human skull, and is sometimes referred to as the "Skull Nebula," though this name is more commonly used for NGC 246, a planetary nebula in Cetus. The cluster and nebula lie at a distance of 5,200 light-years from Earth and measure roughly 130 light years in diameter. The radiation from the young stars excites the atoms in the nebula, causing them to emit radiation themselves producing the emission nebula we see. The mass of the nebula is estimated to be around 10,000 solar masses.',
    type: 'nebula',
    constellation: 'Monoceros',
    imageUrl: '/img/Astro/NGC2237-12.25.31-436x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1.2 hours (436x10sec)',
    location: 'Durham, NC',
    year: 2024,
    catalogues: [
      { type: 'ngc', number: 2237 },
      { type: 'ngc', number: 2238 },
      { type: 'ngc', number: 2239 },
      { type: 'ngc', number: 2246 },
      { type: 'other', number: 'Caldwell 49' },
      { type: 'sharpless', number: 'Sh2-275' },
      { type: 'other', number: 'LBN 948' },
      { type: 'other', number: 'RCW 40' },
      { type: 'other', number: 'C 0634+047' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-8',
    title: 'Pleiades Cluster (M45)',
    date: '2024-12-25',
    shortDescription: 'An open star cluster containing middle-aged, hot B-type stars located in the constellation of Taurus, among the nearest star clusters to Earth.',
    fullDescription: 'The Pleiades (M45), also known as the Seven Sisters, is an open star cluster containing middle-aged, hot B-type stars located in the constellation of Taurus. It is among the star clusters nearest to Earth and is the cluster most obvious to the naked eye in the night sky. The cluster is dominated by hot blue and luminous stars that have formed within the last 100 million years. The name of the Pleiades comes from Ancient Greek mythology, where they represented the Seven Sisters. The cluster is about 444 light-years away and contains over 1,000 confirmed members, though only a handful are visible to the naked eye. The cluster is particularly well-known for its reflection nebulae, which are clouds of interstellar dust that reflect the light of the stars within the cluster.',
    type: 'star-cluster',
    constellation: 'Taurus',
    imageUrl: '/img/Astro/M45-12.25.24-857x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2.3 hours (857x10sec)',
    location: 'Durham, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 45 },
      { type: 'other', number: 'Melotte 22' },
      { type: 'other', number: 'Collinder 42' },
      { type: 'other', number: 'C 0342+239' },
      { type: 'other', number: 'OCl 421.0' },
      { type: 'other', number: 'LBN 189.97-17.92' },
      { type: 'other', number: 'LDN 1495' },
      { type: 'other', number: 'LBN 190.10-18.00' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-9',
    title: 'Orion Nebula (M42)',
    date: '2024-12-01',
    shortDescription: 'The Orion Nebula is a diffuse nebula situated in the Milky Way, being one of the brightest nebulae visible to the naked eye in the night sky.',
    fullDescription: 'The Orion Nebula (also known as Messier 42, M42, or NGC 1976) is a diffuse nebula situated in the Milky Way, being one of the brightest nebulae visible to the naked eye in the night sky. It is located at a distance of 1,344 light-years and is the closest region of massive star formation to Earth. The M42 nebula is estimated to be 24 light-years across and has a mass of about 2,000 times that of the Sun. The nebula has revealed much about the process of how stars and planetary systems are formed from collapsing clouds of gas and dust.',
    type: 'nebula',
    constellation: 'Orion',
    imageUrl: '/img/Astro/M42-12.1.25-394x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1 hour (394x10sec)',
    location: 'Durham, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 42 },
      { type: 'ngc', number: 1976 },
      { type: 'other', number: 'LBN 974' },
      { type: 'sharpless', number: 'Sh2-281' },
      { type: 'other', number: 'W 12' },
      { type: 'other', number: 'OCl 528.0' },
      { type: 'other', number: 'C 0532-048' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-10',
    title: 'Monkey Head Nebula (NGC 2174)',
    date: '2024-12-22',
    shortDescription: 'An emission nebula located in the constellation Orion, known for its resemblance to a monkey\'s head when viewed through a telescope.',
    fullDescription: 'The Monkey Head Nebula (NGC 2174) is an emission nebula located about 6,400 light-years away in the constellation Orion. It is a star-forming region where new stars are being born from the collapsing clouds of gas and dust. The nebula gets its name from its resemblance to a monkey\'s head when viewed through a telescope. The nebula is primarily composed of hydrogen gas that is being ionized by the ultraviolet light from young, hot stars within it, causing it to glow with a characteristic red color. NGC 2174 is part of a larger star-forming region and is a popular target for astrophotographers due to its intricate structures and bright emission regions.',
    type: 'nebula',
    constellation: 'Orion',
    imageUrl: '/img/Astro/NGC2175-12.22.24-1224x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3.4 hours (1224x10sec)',
    location: 'Durham, NC',
    year: 2024,
    catalogues: [
      { type: 'ngc', number: 2174 },
      { type: 'sharpless', number: 'Sh2-252' },
    ],
    processing: 'Stacked and processed using Siril, Astrosharp, and Adobe Lightroom.'
  },
  {
    id: 'dso-11',
    title: 'Crab Nebula (M1)',
    date: '2025-01-01',
    shortDescription: 'A supernova remnant and pulsar wind nebula in the constellation Taurus, the result of a supernova that was observed and recorded by Chinese astronomers in 1054 AD.',
    fullDescription: 'The Crab Nebula (catalogue designations M1, NGC 1952, Taurus A) is a supernova remnant and pulsar wind nebula in the constellation of Taurus. The common name comes from William Parsons, 3rd Earl of Rosse, who observed the object in 1840 using a 36-inch telescope and produced a drawing that looked somewhat like a crab. The nebula was discovered by English astronomer John Bevis in 1731, and it corresponds with a bright supernova recorded by Chinese astronomers in 1054. The nebula was the first astronomical object identified with a historical supernova explosion.\n\nAt the center of the nebula lies the Crab Pulsar, a neutron star 28–30 km across that emits pulses of radiation from gamma rays to radio waves with a spin rate of 30.2 times per second. The nebula was the first source to be identified as a historical supernova explosion. The nebula acts as a source of radiation for studying celestial bodies that occult it. In the 1950s and 1960s, the Sun\'s corona was mapped from observations of the Crab Nebula\'s radio waves passing through it, and in 2003, the thickness of the atmosphere of Saturn\'s moon Titan was measured as it blocked out X-rays from the nebula.',
    type: 'supernova',
    constellation: 'Taurus',
    imageUrl: '/img/Astro/M1-1.1.25-734x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2 hours (734x10sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 1 },
      { type: 'ngc', number: 1952 },
      { type: 'other', number: 'Taurus A' },
      { type: 'other', number: '3C 144' },
      { type: 'other', number: 'SN 1054' },
      { type: 'other', number: '3FGL J0534.5+2201' },
      { type: 'other', number: '2U 0518+17' },
      { type: 'other', number: '3A 0531+219' },
      { type: 'other', number: '1ES 0532+21.5' },
      { type: 'other', number: 'PKS 0531+219' },
      { type: 'other', number: 'PSR B0531+21' },
      { type: 'other', number: 'PSR J0534+2200' },
      { type: 'other', number: 'SN 1054A' },
      { type: 'other', number: '4U 0531+21' },
      { type: 'other', number: 'PBC J0534.5+2201' },
      { type: 'other', number: '2FGL J0534.5+2201i' },
      { type: 'other', number: '3FGL J0534.5+2201i' },
      { type: 'other', number: '2FHL J0534.5+2201' },
      { type: 'other', number: '3FHL J0534.5+2201' },
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
{
    id: 'dso-12',
    title: 'Pinwheel Galaxy (M101)',
    date: '2025-01-04',
    shortDescription: 'A face-on spiral galaxy in the constellation Ursa Major, known for its well-defined spiral arms and high number of star-forming regions.',
    fullDescription: 'The Pinwheel Galaxy (also known as Messier 101, M101, or NGC 5457) is a face-on spiral galaxy in the constellation Ursa Major. It was discovered by Pierre Méchain in 1781 and was one of the original "spiral nebulae" observed by Lord Rosse\'s 72-inch telescope in the 19th century. The galaxy is located about 21 million light-years away from Earth and has a diameter of approximately 170,000 light-years, making it about 70% larger than our Milky Way. M101 is notable for its high number of star-forming regions, which appear as bright pink knots of hydrogen gas in its spiral arms. The galaxy\'s large size, relatively high surface brightness, and nearly face-on orientation make it a popular target for amateur astronomers.',
    type: 'galaxy',
    constellation: 'Ursa Major',
    imageUrl: '/img/Astro/M101-1.4.25-1181x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3.3 hours (1181x10sec)',
    location: 'Bald Head Island, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 101 },
      { type: 'ngc', number: 5457 },
      { type: 'other', number: 'UGC 8981' },
      { type: 'other', number: 'PGC 50063' },
      { type: 'other', number: 'Arp 26' },
      { type: 'other', number: 'MCG+09-23-028' },
      { type: 'other', number: 'IRAS14037+5430' },
      { type: 'other', number: 'KCPG 379A' },
      { type: 'other', number: 'VV 344' },
      { type: 'other', number: 'VV 456' },
      { type: 'other', number: 'Arp 26' },
      { type: 'other', number: 'V V 456' },
      { type: 'other', number: 'V V 403' },
      { type: 'other', number: '2MASS J13300190+4710534' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-13',
    title: 'Markarian\'s Chain',
    date: '2025-03-25',
    shortDescription: 'A stretch of galaxies that forms part of the Virgo Cluster, named after Armenian astrophysicist Benjamin Markarian who discovered their common motion in the early 1960s.',
    fullDescription: 'Markarian\'s Chain is a stretch of galaxies that forms part of the Virgo Cluster. It is named after the Armenian astrophysicist Benjamin Markarian, who discovered their common motion in the early 1960s. The chain consists of at least 8 bright galaxies, including several Messier objects, that appear to move coherently rather than independently. The chain is located in the core of the Virgo Cluster, about 50-70 million light-years away, and includes both elliptical and spiral galaxies. The most prominent members of the chain are the giant elliptical galaxies M84 and M86, which are surrounded by several other bright galaxies including the interacting pair NGC 4438 and NGC 4435 (known as "The Eyes"). The chain is a popular target for amateur astronomers due to the number of bright galaxies that can be seen in a relatively small area of the sky.',
    type: 'galaxy',
    constellation: 'Virgo',
    imageUrl: '/img/Astro/MarkarionsChain-3.1.25-119x20sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1 hour (119x20sec)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'messier', number: 84 },
      { type: 'messier', number: 86 },
      { type: 'ngc', number: 4435 },
      { type: 'ngc', number: 4438 },
      { type: 'ngc', number: 4461 },
      { type: 'ngc', number: 4458 },
      { type: 'ngc', number: 4473 },
      { type: 'ngc', number: 4477 },
      { type: 'other', number: 'VV 488' },  // Interacting pair of NGC 4435/4438
      { type: 'other', number: 'Arp 120' }, // M84 and NGC 4388
      { type: 'other', number: 'UGC 7584' }, // NGC 4438
      { type: 'other', number: 'PGC 40898' }, // M86
      { type: 'other', number: 'PGC 41202' }  // M84
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-14',
    title: 'Andromeda Galaxy (M31)',
    date: '2025-09-05',
    shortDescription: 'The Andromeda Galaxy, also known as Messier 31 or M31, is a barred spiral galaxy approximately 2.5 million light-years from Earth and the nearest large galaxy to the Milky Way.',
    fullDescription: 'The Andromeda Galaxy, also known as Messier 31, M31, or NGC 224, is a barred spiral galaxy approximately 2.5 million light-years from Earth and the nearest large galaxy to the Milky Way. It was originally named the Andromeda Nebula and is cataloged as Messier 31. The galaxy\'s name stems from the area of Earth\'s sky in which it appears, the constellation of Andromeda. The Andromeda Galaxy is the largest galaxy in the Local Group, which also contains the Milky Way, the Triangulum Galaxy, and about 30 other smaller galaxies. With a diameter of about 220,000 light-years, it is the largest galaxy of the Local Group, which also contains the Milky Way, the Triangulum Galaxy, and about 44 other smaller galaxies. The Milky Way and Andromeda galaxies are expected to collide in about 4.5 billion years, eventually merging to form a giant elliptical galaxy or a large lenticular galaxy.',
    type: 'galaxy',
    constellation: 'Andromeda',
    imageUrl: '/img/Astro/M31-9.5.25-336x30sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3 hours (336x30sec)',
    location: 'Bald Head Island, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 31 },
      { type: 'messier', number: 31 },
      { type: 'ngc', number: 224 },
      { type: 'other', number: 'UGC 454' },
      { type: 'other', number: 'PGC 2557' },
      { type: 'other', number: 'MCG+07-02-016' },
      { type: 'other', number: 'IRAS00400+4059' },
      { type: 'other', number: '2MASS J00424433+4116074' },
      { type: 'other', number: 'LEDA 2557' },
      { type: 'other', number: 'Z 535-17' },
      { type: 'other', number: '1ES 0040+40.9' },
      { type: 'other', number: '2FGL J0042.2+4114' },
      { type: 'other', number: '3FGL J0042.5+4114' },
      { type: 'other', number: '3FHL J0042.7+4115' },
      { type: 'other', number: '3C 28.0' },
      { type: 'other', number: '4C +41.02' },
      { type: 'other', number: '2U 0038+40' },
      { type: 'other', number: '3U 0038+40' },
      { type: 'other', number: '4U 0038+40' },
      { type: 'other', number: 'PBC J0042.7+4114' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-15',
    title: 'Leo Triplet (M66 Group)',
    date: '2025-04-15',
    shortDescription: 'The Leo Triplet is a small group of interacting spiral galaxies in the constellation Leo, consisting of M65, M66, and NGC 3628, located about 35 million light-years away from Earth.',
    fullDescription: 'The Leo Triplet, also known as the M66 Group, is a small group of interacting spiral galaxies in the constellation Leo. This galaxy group consists of the three prominent spiral galaxies M65 (NGC 3623), M66 (NGC 3627), and NGC 3628, also known as the Hamburger Galaxy. These galaxies are located about 35 million light-years from Earth and are gravitationally interacting with each other, which has led to some distortion in their shapes and triggered star formation. The group is one of the most famous galaxy trios in the night sky and is a popular target for amateur astronomers. M66 is the largest and brightest of the three, while NGC 3628 is seen edge-on, revealing its prominent dust lane. The interaction between these galaxies has created long tidal tails and distorted their spiral arms, making them excellent subjects for studying galactic interactions and evolution.',
    type: 'galaxy',
    constellation: 'Leo',
    imageUrl: '/img/Astro/Leo\'sTriplet-4.15.25-338x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1 hour (338x10sec)',
    location: 'Bald Head Island, NC',
    year: 2025,
    catalogues: [
      // M65 (NGC 3623)
      { type: 'messier', number: 65 },
      { type: 'ngc', number: 3623 },
      { type: 'other', number: 'UGC 6328' },
      { type: 'other', number: 'PGC 34612' },
      { type: 'other', number: 'ARP 317' },
      // M66 (NGC 3627)
      { type: 'messier', number: 66 },
      { type: 'ngc', number: 3627 },
      { type: 'other', number: 'UGC 6346' },
      { type: 'other', number: 'PGC 34695' },
      { type: 'other', number: 'ARP 16' },
      { type: 'other', number: 'ARP 317' },
      // NGC 3628 (Hamburger Galaxy)
      { type: 'ngc', number: 3628 },
      { type: 'other', number: 'UGC 6350' },
      { type: 'other', number: 'PGC 34697' },
      { type: 'other', number: 'ARP 317' },
      // Group designations
      { type: 'other', number: 'LGG 231' }, // Lyon Group of Galaxies
      { type: 'other', number: 'USGC U376' }, // UZC Catalog of Groups
      { type: 'other', number: 'HICK 56' }, // Hickson Compact Group
      // Additional catalog numbers for individual galaxies
      { type: 'other', number: 'IRAS 11176+1313' }, // M65
      { type: 'other', number: '2MASX J11181894+1303299' }, // M65
      { type: 'other', number: 'IRAS 11185+1302' }, // M66
      { type: 'other', number: '2MASX J11201522+1259029' }, // M66
      { type: 'other', number: 'IRAS 11184+1350' }, // NGC 3628
      { type: 'other', number: '2MASX J11201942+1334120' }  // NGC 3628
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-16',
    title: 'Jellyfish Nebula (IC 443)',
    date: '2024-01-01',
    shortDescription: 'The Jellyfish Nebula is a supernova remnant (SNR) in the constellation Gemini, located about 5,000 light-years from Earth, known for its jellyfish-like shape and complex structure.',
    fullDescription: 'The Jellyfish Nebula (IC 443, Sharpless 248) is a galactic supernova remnant (SNR) in the constellation Gemini. It is located about 5,000 light-years from Earth and is believed to be the remains of a supernova that occurred between 3,000 and 30,000 years ago. The nebula gets its name from its jellyfish-like shape, with a semicircular shell and tentacle-like filaments of gas. The supernova explosion that created IC 443 left behind a rapidly spinning neutron star (pulsar) known as CXOU J061705.3+222127, which is located near the edge of the remnant. The nebula is interacting with a nearby molecular cloud, which is causing shock waves that heat the gas and make it glow in various wavelengths, from radio to X-rays. The complex structure of IC 443 makes it a popular target for both amateur and professional astronomers studying supernova remnants and their interaction with the interstellar medium.',
    type: 'supernova',
    constellation: 'Gemini',
    imageUrl: '/img/Astro/IC443-1.1.25-446x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1.2 hours (446x10sec)',
    location: 'Bald Head Island, NC',
    year: 2025,
    catalogues: [
      { type: 'ic', number: 443 },
      { type: 'sharpless', number: 'Sh2-248' },
      { type: 'other', number: 'LBN 844' },
      { type: 'other', number: 'LBN II 224.0-03.0' },
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-17',
    title: 'Flame & Horsehead Nebulae',
    date: '2024-11-23',
    shortDescription: 'The Flame Nebula (NGC 2024) and Horsehead Nebula (Barnard 33) are two iconic deep-sky objects in the constellation Orion, located about 1,400 light-years from Earth.',
    fullDescription: 'The Flame Nebula (NGC 2024) and Horsehead Nebula (Barnard 33) are two of the most famous deep-sky objects in the constellation Orion, located about 1,400 light-years from Earth. The Flame Nebula is an emission nebula that gets its name from the dark lanes of dust that appear to form a flaming pattern. It is illuminated by the bright star Alnitak, the easternmost star in Orion\'s Belt. The Horsehead Nebula is a dark nebula located just south of Alnitak, famous for its distinctive horsehead shape when viewed from Earth. This dark cloud of dust and gas is silhouetted against the bright emission nebula IC 434. Both nebulae are part of the much larger Orion Molecular Cloud Complex, a vast star-forming region that includes the famous Orion Nebula (M42). The area is rich in young stars and stellar nurseries, making it a prime target for both amateur and professional astronomers.',
    type: 'nebula',
    constellation: 'Orion',
    imageUrl: '/img/Astro/IC434-12.21.24-21x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '21x10sec',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      // Flame Nebula (NGC 2024)
      { type: 'ngc', number: 2024 },
      { type: 'other', number: 'LBN 944' },
      { type: 'sharpless', number: 'Sh2-277' },
      // Horsehead Nebula (Barnard 33) and IC 434
      { type: 'barnard', number: 33 },
      { type: 'ic', number: 434 },
      { type: 'other', number: 'LBN 945' },
      { type: 'other', number: 'LBN 206.45-16.46' },
      // Additional designations
      { type: 'other', number: 'LBN 081.11+00.14' },  // For NGC 2024
      { type: 'other', number: 'LBN 081.12+00.14' },  // For NGC 2024
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-18',
    title: 'Great Hercules Cluster (M13)',
    date: '2025-01-01',
    shortDescription: 'The Hercules Globular Cluster is a globular cluster containing several hundred thousand stars in the constellation of Hercules.',
    fullDescription: 'Messier 13 (M13), also known as the Great Hercules Cluster or the Hercules Globular Cluster, is a globular cluster of several hundred thousand stars in the constellation of Hercules. It was discovered by Edmond Halley in 1714 and later cataloged by Charles Messier in 1764. M13 is about 145 light-years in diameter and lies about 22,200 light-years away from Earth. It is one of the brightest and best-known globular clusters in the northern celestial hemisphere, visible to the naked eye under good conditions.',
    type: 'star-cluster',
    constellation: 'Hercules',
    imageUrl: '/img/Astro/M13-1.1.25-212x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '0.5 hours (212x10sec)',
    location: 'Bald Head Island, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 13 },
      { type: 'ngc', number: 6205 },
      { type: 'other', number: 'GCL 45' },
      { type: 'other', number: 'C 1639+365' },
      { type: 'other', number: 'GCl 45'}
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-19',
    title: 'Heart Nebula (IC 1805)',
    date: '2025-25-25',
    shortDescription: 'An emission nebula in the constellation Cassiopeia, named for its resemblance to a heart shape, with young open star cluster Melotte 15 at its center.',
    fullDescription: 'The Heart Nebula (IC 1805) is an emission nebula located in the Perseus Arm of the Milky Way in the constellation Cassiopeia. It lies about 7,500 light-years away from Earth and spans approximately 200 light-years across. The nebula is energized by the open star cluster Melotte 15 at its center, which contains several bright, massive stars up to 50 times the mass of our Sun. The intense radiation and stellar winds from these young stars have carved out the nebula\'s distinctive shape and caused the surrounding hydrogen gas to glow red. The Heart Nebula is often imaged alongside its neighbor, the Soul Nebula (IC 1848).',
    type: 'nebula',
    constellation: 'Cassiopeia',
    imageUrl: '/img/Astro/IC1805-1.25.25-418x30sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3.5 hours (418x30sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'ic', number: 1805 },
      { type: 'sharpless', number: 'Sh2-190' },
      { type: 'other', number: 'LBN 654' },
      { type: 'other', number: 'C 0236+611' },
      { type: 'other', number: 'W 8' },
      { type: 'other', number: 'CTB 2' }
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-20',
    title: 'Eastern Veil Nebula (NGC 6992)',
    date: '2024-12-24',
    shortDescription: 'The Eastern Veil Nebula (NGC 6992) is a large supernova remnant in the constellation Cygnus, located about 2,400 light-years from Earth, known for its delicate filamentary structures.',
    fullDescription: 'The Eastern Veil Nebula (NGC 6992) is part of the larger Veil Nebula complex, a supernova remnant in the constellation Cygnus. This spectacular nebula is the result of a massive star that exploded approximately 10,000-20,000 years ago. The Eastern Veil is particularly notable for its delicate, wispy filaments of ionized gas that glow in various colors due to different elements being excited by the energy from the supernova explosion. The nebula spans about 3 degrees in the sky (about 6 times the diameter of the full Moon) and is located about 2,400 light-years from Earth. The entire Veil Nebula complex is one of the most spectacular supernova remnants visible from Earth and is a favorite target for astrophotographers and visual observers alike.',
    type: 'supernova',
    constellation: 'Cygnus',
    imageUrl: '/img/Astro/NGC6992-12.21.24-221x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '1 hour (221x10sec)',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'ngc', number: 6992 },  // Eastern Veil
      { type: 'ngc', number: 6995 },  // Part of the complex
      { type: 'ic', number: 1340 },   // Part of the complex
      { type: 'other', number: 'LBN 191' },   // LBN 191
      { type: 'sharpless', number: 'Sh2-103' },   // Sharpless 103
      { type: 'other', number: 'LBN 191.00-11.40' },
      { type: 'other', number: 'LBN 191.00-11.50' },
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-21',
    title: 'IC 1590',
    date: '2024-04-10',
    shortDescription: 'IC 1590 is a young open star cluster located in the constellation Cassiopeia, embedded within the emission nebula NGC 281, also known as the Pacman Nebula.',
    fullDescription: 'IC 1590 is a young open star cluster located in the constellation Cassiopeia, embedded within the emission nebula NGC 281, more commonly known as the Pacman Nebula. This star-forming region is located about 9,200 light-years from Earth and contains several massive, hot, young stars that are responsible for ionizing the surrounding gas, causing it to glow. The cluster is relatively young, with an estimated age of only a few million years. The most prominent member of the cluster is the multiple star system HD 5005 (also known as BD+55 191), which is an O-type star that provides much of the energy that makes the nebula visible. The entire region is an active site of star formation, with dark dust lanes and Bok globules scattered throughout the nebula, indicating ongoing star formation. IC 1590 and NGC 281 are part of the Perseus Spiral Arm of our Milky Way galaxy.',
    type: 'star-cluster',
    constellation: 'Cassiopeia',
    imageUrl: '/img/Astro/IC1590-04.10.24.jpg',
    telescope: 'Seestar S50',
    exposure: '113x10s',
    location: 'Bald Head Island, NC',
    year: 2024,
    catalogues: [
      { type: 'ic', number: 1590 },
      { type: 'ngc', number: 281 },  // Associated Pacman Nebula
      { type: 'sharpless', number: 'Sh2-184' },
      { type: 'other', number: 'LBN 616' },
      { type: 'other', number: 'LBN 123.08-06.29' },
    ],
    processing: 'Re-stacked and processed using Siril, Astrosharp, GraXpert, and Adobe Lightroom.'
  },
  {
    id: 'dso-22',
    title: 'Andromeda Galaxy (M31)',
    date: '2025-10-06',
    shortDescription: 'The Andromeda Galaxy, our nearest large galactic neighbor, is a barred spiral galaxy about 2.5 million light-years away in the constellation Andromeda.',
    fullDescription: 'The Andromeda Galaxy (M31) is a barred spiral galaxy located approximately 2.5 million light-years from Earth in the constellation Andromeda. It is the closest spiral galaxy to our Milky Way and is on a collision course with our galaxy, expected to merge in about 4.5 billion years. This image is a reprocessed composite of multiple sessions, combining the best data from various integration times to bring out the fine details in the galaxy\'s spiral arms, dust lanes, and satellite galaxies M32 and M110. The processing emphasizes the subtle details in the galactic core while preserving the natural gradient of the galaxy\'s disk and the faint outer regions that extend far beyond the bright central region.',
    type: 'galaxy',
    constellation: 'Andromeda',
    imageUrl: '/img/Astro/M31-10.6.25-4.75hours.jpg',
    telescope: 'Seestar S50',
    exposure: '4h 40m (multiple sessions)',
    location: 'Various',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 31 },
      { type: 'ngc', number: 224 },
      { type: 'other', number: 'UGC 454' },
      { type: 'other', number: 'PGC 2557' },
      { type: 'other', number: 'MCG+07-02-016' }
    ],
    processing: 'Reprocessed using data from multiple sessions. Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-23',
    title: 'Cocoon Nebula (IC 5146)',
    date: '2025-09-25',
    shortDescription: 'A beautiful emission and reflection nebula in the constellation Cygnus, known for its dark dust lanes and star-forming regions.',
    fullDescription: 'The Cocoon Nebula (IC 5146) is a striking emission/reflection nebula located about 2,500 light-years away in the constellation Cygnus. This stellar nursery is a region where new stars are being born, and its glowing hydrogen gas is being excited by the young, hot stars at its center. The nebula is surrounded by a dark molecular cloud (Barnard 168) that gives it a distinctive cocoon-like appearance. The image captures the delicate balance between the glowing red hydrogen gas (Hα emission) and the dark, obscuring dust lanes that weave through the nebula. The central star cluster (Collinder 470) contains several young, massive stars that illuminate the surrounding gas and dust.',
    type: 'nebula',
    constellation: 'Cygnus',
    imageUrl: '/img/Astro/IC5146-9.5.25-345x30sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2.8 hours (345x30sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'ic', number: 5146 },
      { type: 'other', number: 'Sh2-125' },
      { type: 'other', number: 'LBN 424' },
      { type: 'other', number: 'Caldwell 19' },
      { type: 'other', number: 'Cr 470' }
    ],
    processing: 'Stacked and processed using Siril, Astrosharp, and Adobe Lightroom.'
  },
  {
    id: 'dso-24',
    title: 'Lagoon Nebula (M8)',
    date: '2025-09-25',
    shortDescription: 'A giant interstellar cloud in the constellation Sagittarius, known for its bright hourglass shape and active star-forming regions.',
    fullDescription: 'The Lagoon Nebula (M8) is a giant interstellar cloud in the constellation Sagittarius, approximately 4,100 light-years from Earth. This stunning emission nebula is one of only two star-forming nebulae faintly visible to the naked eye from mid-northern latitudes. The nebula gets its name from the dark lane of dust that divides it into two sections, resembling a lagoon. At its center lies the open cluster NGC 6530, containing many hot, young stars that illuminate the surrounding gas. The most prominent feature is the hourglass-shaped region near the center, which is being shaped by the intense radiation and stellar winds from the young, massive star Herschel 36. The nebula spans about 110 by 50 light-years and is an active stellar nursery where new stars continue to form within its dense molecular clouds.',
    type: 'nebula',
    constellation: 'Sagittarius',
    imageUrl: '/img/Astro/M8-6.24.25-198x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '33min (198x10s)',
    location: 'Bald Head Island, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 8 },
      { type: 'ngc', number: 6523 },
      { type: 'other', number: 'Sh2-25' },
      { type: 'other', number: 'RCW 146' },
      { type: 'other', number: 'Gum 72' },
      { type: 'other', number: 'LBN 25' }
    ],
    processing: 'Stacked and processed using Siril, Astrosharp, and Adobe Lightroom. '
  },
  {
    id: 'dso-25',
    title: 'Crab Nebula (M1)',
    date: '2025-10-08',
    shortDescription: 'A supernova remnant in the constellation Taurus, the result of a supernova that was observed and recorded by Chinese astronomers in 1054 AD.',
    fullDescription: 'The Crab Nebula (Messier 1 or M1) is a supernova remnant in the constellation Taurus. The nebula was the first astronomical object identified with a historical supernova explosion. The supernova was observed by Chinese astronomers in 1054 AD and was bright enough to be seen in the daytime for 23 days and in the night sky for nearly two years. At the center of the nebula lies the Crab Pulsar, a neutron star that emits pulses of radiation from gamma rays to radio waves with a spin rate of 30.2 times per second. The nebula is about 6,500 light-years from Earth and is expanding at a rate of about 1,500 km/s.',
    type: 'supernova',
    constellation: 'Taurus',
    imageUrl: '/img/Astro/M1-10.8.25-1329x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3.7 hours (1329x10sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 1 },
      { type: 'ngc', number: 1952 },
      { type: 'sharpless', number: 'Sh2-244' },
      { type: 'other', number: 'Crab Nebula' },
      { type: 'other', number: 'Taurus A' }
    ],
    processing: 'Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-26',
    title: 'Trifid Nebula (M20)',
    date: '2025-10-08',
    shortDescription: 'A combination of an open star cluster, an emission nebula, a reflection nebula, and a dark nebula in Sagittarius, located about 4,100 light-years from Earth.',
    fullDescription: 'The Trifid Nebula (Messier 20 or M20) is an H II region in the constellation Sagittarius. It was discovered by Charles Messier on June 5, 1764. The nebula is a combination of an open star cluster, an emission nebula (the lower, red portion), a reflection nebula (the upper, blue portion), and a dark nebula (the apparent gaps within the emission nebula that cause the trifurcated appearance). The nebula is approximately 4,100 light-years away from Earth and is about 40 light-years across. The bright star cluster at the center of the nebula is cataloged as C 1759-230 and contains several hot, massive stars that illuminate the surrounding gas and dust.',
    type: 'nebula',
    constellation: 'Sagittarius',
    imageUrl: '/img/Astro/M20-10.8.25-6x20sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2 minutes (6x20sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 20 },
      { type: 'ngc', number: 6514 },
      { type: 'sharpless', number: 'Sh2-30' },
      { type: 'other', number: 'Trifid Nebula' }
    ],
    processing: 'Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-27',
    title: 'Triangulum Galaxy (M33)',
    date: '2025-10-08',
    shortDescription: 'A spiral galaxy about 2.73 million light-years from Earth in the constellation Triangulum, the third-largest member of the Local Group of galaxies.',
    fullDescription: 'The Triangulum Galaxy (Messier 33 or M33) is a spiral galaxy approximately 2.73 million light-years from Earth in the constellation Triangulum. It is the third-largest member of the Local Group of galaxies, which includes the Milky Way, the Andromeda Galaxy, and about 80 other smaller galaxies. M33 has a diameter of about 60,000 light-years, making it about half the size of the Milky Way. It is one of the most distant permanent objects that can be viewed with the naked eye under good conditions. The galaxy contains about 40 billion stars, compared to 100-400 billion in the Milky Way. M33 is home to numerous H II regions, including the enormous NGC 604, one of the largest H II regions known.',
    type: 'galaxy',
    constellation: 'Triangulum',
    imageUrl: '/img/Astro/M33-10.8.25-1617x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '4.5 hours (1617x10sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 33 },
      { type: 'ngc', number: 598 },
      { type: 'other', number: 'Triangulum Galaxy' },
      { type: 'other', number: 'Pinwheel Galaxy' },
      { type: 'other', number: 'UGC 1117' },
      { type: 'other', number: 'PGC 5818' }
    ],
    processing: 'Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-28',
    title: 'Whirlpool Galaxy (M51)',
    date: '2025-10-09',
    shortDescription: 'An interacting grand-design spiral galaxy in the constellation Canes Venatici, located about 23 million light-years from Earth.',
    fullDescription: 'The Whirlpool Galaxy (Messier 51 or M51) is an interacting grand-design spiral galaxy in the constellation Canes Venatici. It is one of the most famous galaxies in the sky, known for its prominent spiral arms and its interaction with the smaller galaxy NGC 5195. The galaxy is located about 23 million light-years from Earth and has a diameter of about 76,000 light-years. The interaction between M51 and its companion has enhanced the spiral structure of M51 and triggered significant star formation in both galaxies. The Whirlpool Galaxy was the first galaxy to be classified as a spiral galaxy, by Lord Rosse in 1845, using his 72-inch reflecting telescope at Birr Castle in Ireland.',
    type: 'galaxy',
    constellation: 'Canes Venatici',
    imageUrl: '/img/Astro/M51-10.9.25-59x20sec.jpg',
    telescope: 'Seestar S50',
    exposure: '19.7 minutes (59x20sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 51 },
      { type: 'ngc', number: 5194 },
      { type: 'other', number: 'Whirlpool Galaxy' },
      { type: 'other', number: 'UGC 8493' },
      { type: 'other', number: 'PGC 47404' }
    ],
    processing: 'Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-29',
    title: 'M96 Group',
    date: '2025-01-04',
    shortDescription: 'A group of galaxies in the constellation Leo, including the spiral galaxy M96, about 31 million light-years from Earth.',
    fullDescription: 'The M96 Group (also known as the Leo I Group) is a group of galaxies in the constellation Leo. The group includes the spiral galaxies M95, M96, and M105, along with several fainter galaxies. M96 is the brightest member of the group and is located about 31 million light-years from Earth. The group is part of the Virgo Supercluster and is one of the many galaxy groups that make up the Virgo Supercluster. M96 is a barred spiral galaxy with a bright nucleus and well-defined spiral arms that contain regions of star formation. The galaxy has a diameter of about 100,000 light-years, making it similar in size to our own Milky Way.',
    type: 'galaxy',
    constellation: 'Leo',
    imageUrl: '/img/Astro/M96-1.4.25-769-10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2.1 hours (769x10sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 96 },
      { type: 'ngc', number: 3368 },
      { type: 'other', number: 'Leo I Group' },
      { type: 'other', number: 'M96 Group' },
      { type: 'other', number: 'UGC 5882' },
      { type: 'other', number: 'PGC 32192' }
    ],
    processing: 'Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-30',
    title: 'Pacman Nebula (NGC 281)',
    date: '2025-10-07',
    shortDescription: 'An H II region in the constellation Cassiopeia, named for its resemblance to the video game character Pac-Man, located about 9,200 light-years from Earth.',
    fullDescription: 'The Pacman Nebula (NGC 281) is an H II region in the constellation Cassiopeia. It is sometimes called the Pacman Nebula because of its appearance in optical images, which resembles the video game character. The nebula is located about 9,200 light-years from Earth and is part of the Perseus Spiral Arm of the Milky Way. The nebula contains a large amount of dust and gas, which is being ionized by the young, hot stars of the open cluster IC 1590 at its center. The nebula is a site of active star formation, and the radiation and stellar winds from the young stars are shaping the surrounding gas and dust into complex structures, including dark lanes and bright rims.',
    type: 'nebula',
    constellation: 'Cassiopeia',
    imageUrl: '/img/Astro/NGC281-10.7.25-573x20sec.jpg',
    telescope: 'Seestar S50',
    exposure: '3.2 hours (573x20sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'ngc', number: 281 },
      { type: 'ic', number: 1590 },
      { type: 'sharpless', number: 'Sh2-184' },
      { type: 'other', number: 'Pacman Nebula' },
      { type: 'other', number: 'Barnard 1' },
      { type: 'other', number: 'LBN 616' }
    ],
    processing: 'Stacked and processed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-31',
    title: 'Pinwheel Galaxy (M101)',
    date: '2025-10-09',
    shortDescription: 'A face-on spiral galaxy in the constellation Ursa Major, known for its well-defined spiral arms and high number of star-forming regions, located about 21 million light-years from Earth.',
    fullDescription: 'The Pinwheel Galaxy (Messier 101 or M101) is a face-on spiral galaxy in the constellation Ursa Major. It is one of the most prominent examples of a grand design spiral galaxy, with well-defined spiral arms that can be traced continuously to its center. The galaxy is about 21 million light-years away from Earth and has a diameter of about 170,000 light-years, making it about 70% larger than our Milky Way. M101 is notable for its high number of H II regions, many of which are very large and bright, indicating active star formation. The galaxy has a relatively low surface brightness, making it a challenging but rewarding target for amateur astronomers. It is estimated to contain about one trillion stars, and its spiral arms are dotted with star-forming regions and young, hot, blue stars that give the galaxy its bluish tint.',
    type: 'galaxy',
    constellation: 'Ursa Major',
    imageUrl: '/img/Astro/M101-10.9.25-45x20sec.jpg',
    telescope: 'Seestar S50',
    exposure: '15 minutes (45x20sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 101 },
      { type: 'ngc', number: 5457 },
      { type: 'other', number: 'Pinwheel Galaxy' },
      { type: 'other', number: 'UGC 8981' },
      { type: 'other', number: 'PGC 50063' },
      { type: 'other', number: 'Caldwell 31' }
    ],
    processing: 'Re-stacked and reprocessed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-32',
    title: 'Thor\'s Helmet (NGC 2359) - Reprocessed',
    date: '2025-10-09',
    shortDescription: 'A nebula in the constellation Canis Major, resembling the helmet of the Norse god Thor, sculpted by powerful stellar winds from a massive Wolf-Rayet star. This is a reprocessed version of the original data.',
    fullDescription: 'Thor\'s Helmet (NGC 2359) is an emission nebula in the constellation Canis Major. The nebula has a distinctive bubble-like shape with extended filamentary structures, created by the powerful stellar winds from the extremely hot Wolf-Rayet star HD 56925 at its center. This massive star is in a late stage of stellar evolution, shedding its outer layers at tremendous speeds, which collide with surrounding interstellar material to create the complex nebular structures. The nebula is approximately 11,960 light-years from Earth and spans about 30 light-years across. This version has been reprocessed to reveal additional detail in the fainter outer regions and improve the overall contrast and color balance.',
    type: 'nebula',
    constellation: 'Canis Major',
    imageUrl: '/img/Astro/NGC2395-10.9.25-946x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2.6 hours (946x10sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'ngc', number: 2359 },
      { type: 'other', number: 'Thor\'s Helmet' },
      { type: 'other', number: 'Gum 4' },
      { type: 'other', number: 'Sh2-298' },
      { type: 'other', number: 'LBN 1048' },
      { type: 'other', number: 'RCW 5' }
    ],
    processing: 'Re-stacked and reprocessed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  },
  {
    id: 'dso-33',
    title: 'Bode\'s Galaxy (M81) - Reprocessed',
    date: '2025-10-09',
    shortDescription: 'A grand design spiral galaxy in Ursa Major, about 12 million light-years away, shown here in a newly processed version with enhanced detail and color.',
    fullDescription: 'Bode\'s Galaxy (Messier 81 or M81) is a grand design spiral galaxy in the constellation Ursa Major. This magnificent island universe is one of the brightest galaxies visible from Earth and is located approximately 12 million light-years away. The galaxy spans about 90,000 light-years across and is the largest member of the M81 Group, which includes about 34 galaxies. M81 is notable for its well-defined spiral arms that extend from its bright nucleus, which contains a supermassive black hole about 70 million times the mass of our Sun. This reprocessed version of the data brings out additional detail in the spiral arms and shows the complex dust lanes and star-forming regions with improved clarity. The image also captures the faint tidal streams of stars that are evidence of past gravitational interactions with its neighbor, the starburst galaxy M82.',
    type: 'galaxy',
    constellation: 'Ursa Major',
    imageUrl: '/img/Astro/M81-10.9.25-907x10sec.jpg',
    telescope: 'Seestar S50',
    exposure: '2.5 hours (907x10sec)',
    location: 'Durham, NC',
    year: 2025,
    catalogues: [
      { type: 'messier', number: 81 },
      { type: 'ngc', number: 3031 },
      { type: 'other', number: 'Bode\'s Galaxy' },
      { type: 'other', number: 'UGC 5318' },
      { type: 'other', number: 'PGC 28630' },
      { type: 'other', number: 'Arp 16' },
      { type: 'other', number: 'KPG 218A' }
    ],
    processing: 'Re-stacked and reprocessed using Siril, Nazstronomy, CosmicClarity, and HDR-Multiscale.'
  }
];
