export type EvolutionSimPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  content: string[];
};

export const evolutionSimPosts: EvolutionSimPost[] = [
  {
    slug: 'devlog-0-biogenesis',
    title: 'Devblog 0 - Biogenesis!',
    date: '2026-07-06',
    excerpt:
      'The origin story of EvolutionSim: from chemical evolution and first principles simulation to a neural network-driven creature simulator inspired by Factorio and Oxygen Not Included.',
    content: [
      'I wanted to document my process for developing my side project - EvolutionSim. The name will most likely change, but that\'s what it is for now. I want to explain my thought processes, document my journey, etc.',
      'The idea for a simulation started when learning about what modern scientists call "chemical evolution", or the idea that the first creatures were little more than a bundle of chemicals who\'s potential energy sat lower than the rest of the chemical soup around them, and as such were stable. Enough of these different stable-ish chemical compounds were made that a couple of them happened to be in the form similar to a DNA strand - one side of the chemical matches well with another. (While obviously being orders of magnitude less complex) Only this time, the mirror match was a copy of the original molecule. This, in turn, created a linear growth rate for these molecular creatures - and simultaneously created an ecosystem where different molecules would "compete" for the primitive building blocks. The building blocks, like simple amino acids and such, are known to spontaneously generate in early Earth-like conditions, see the [Miller-Urey Experiment](https://en.wikipedia.org/wiki/Miller%E2%80%93Urey_experiment) for more info.',
      'This got me thinking: if we understand molecules down to the atomic level, have proven we can simulate their interactions via equations like Van Der Walls (London, Debye, Keesom), understand macro-molecular interactions through good old Gibbs Free Energy, what\'s stopping us from simulating the entire evolutionary world from the ground up based on on first principles?',
      'I quickly learned why - the computational cost is enormous. At minimum, the simulation scales with O(n), and at worst O(n^2). With baseline mathematics and a simulation size of billions of atoms (approximately 0.000000000000166% of a mole), and you get simulation times that are longer than I\'m willing to sit around for. Plus, I don\'t want to see a couple of carbon atoms linking together, I want to see cellular life. I want to see evolutionary behaviors emerging from competing species. So I scrapped the idea of a ground up simulation and set my sights on something a bit leaner - a simple simulation where creatures driven by neural networks grow and evolve in a simulation, competing for resources and food.',
      'I play lots of simulator games, two of my favorite being Factorio and Oxygen Not Included. The former boasts millions of calculations per second, an extremely polished user experience, and quality of life upgrades you didn\'t know you wanted; the second a thermal, pressure, germ, liquid, and technology sim management game that makes any engineer happy - with the noticeable exception that large bases run fairly poor on my home-made pc (I was not alone in my gripes against performance). The entire game is designed on real world constants - the thermal system is calculated in kelvin, pressures are in atmospheres, and thermal conductivity between tiles are calculated via real-world coefficients. It\'s a blast.',
      'So I set my sights on my goal: a game with the same C++ optimized pipeline like factorio, but infused with real world coefficients driving a realistic environment where creatures can adapt, survive (or die), and evolve.',
      'And so I began.',
    ],
  },
];

export function getPostBySlug(slug: string): EvolutionSimPost | undefined {
  return evolutionSimPosts.find((post) => post.slug === slug);
}
