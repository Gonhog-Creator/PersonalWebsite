export type EvolutionSimPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  content: string;
};

export const evolutionSimPosts: EvolutionSimPost[] = [
  {
    slug: 'devlog-1-creating-the-world',
    title: 'Devblog 1 - Creating the world',
    date: '2026-07-07',
    excerpt:
      'Building the tile-based world with double-buffered physics: tracking temperature, oxygen, pressure, depth, nutrients, and more with real-world coefficients.',
    tags: ['physics', 'simulation', 'rust'],
    content: `As discussed in the first blog, I wanted to create a world that gave the simulated creatures the most realistic environment possible - so in the fashion of Oxygen Not Included, the entire map is divided into tiles, either solid gas or liquid, and each tile interacts with its neighbors through different subsystems.

The map, which has shapeshifted several times, is a vectorized tile map that uses a double buffer for its physics updates. As of now, each tile tracks: kind, temperature, oxygen, pressure, depth, nutrients, heat_source, nutrient_regen, vertical_velocity, dynamic_pressure, terrain_flags, and biome. Each constant is tied to real values and normal equations I learned from textbooks.

\`\`\`rust
P_ATM          = 101_325   // Pa
RHO_WATER      = 1025      // kg/m³
G              = 9.80665   // m/s²
ALPHA_THERMAL  = 2.1×10⁻⁴ // 1/°C
D_TEMP         = 0.5       // m²/s
D_O2           = 1.5×10⁻⁵  // m²/s
D_NUTRIENTS    = 0.01      // m²/s
DX             = 1.0       // m per tile
GAS_TRANSFER_K = 0.01      // 1/s
CONVECT_DAMPING= 0.5       // 1/s
\`\`\`

**Dissolved Oxygen Saturation**

> Polynomial fit used to compute the oxygen ceiling at a given temperature:

$$\\text{sat}(T) = 14.652 - 0.41022T + 0.007991T^2 - 7.7774 \\times 10^{-5}T^3$$

**Discrete Laplacian (Diffusion Operator)**

> For any scalar field $f$, the 5-point Laplacian on the cardinal neighbors is:

$$\\nabla^2 f = \\frac{f_{left} + f_{right} + f_{down} + f_{up} - 4f}{DX^2}$$

**Pressure**

> Local water density depends on temperature:
>
> $$\\rho_{local} = \\rho_{water}\\bigl(1 - \\alpha_{thermal}(T - 4)\\bigr)$$
>
> Hydrostatic pressure at depth:
>
> $$P_{hydro} = P_{atm} + \\rho_{local} g d$$
>
> Dynamic pressure from vertical convection velocity $w$:
>
> $$P_{dyn} = -\\rho_{water} g w \\times 0.1$$
>
> Total pressure stored on the tile:
>
> $$P = P_{hydro} + P_{dyn}$$

**Convection (Vertical Velocity)**

> Buoyancy term comparing the tile's temperature to the tile below it:

$$w_{new} = w + dt\\bigl(g \\alpha_{thermal}(T - T_{below}) - k_{damp} w\\bigr)$$

**Advection**

> Vertical flow carries scalars up or down. With upward flow ($w > 0$) the tile loses mass to the tile above; with downward flow it loses mass to the tile below:

$$\\text{adv}f = \\begin{cases} w\\dfrac{f_{up} - f}{DX}, & w > 0 \\\\ w\\dfrac{f - f_{down}}{DX}, & w \\le 0 \\end{cases}$$

**Temperature Update**

> Diffusion + heat source - advection:

$$T_{new} = T + dt\\bigl(D_{temp} \\nabla^2 T + q_{source} - \\text{adv}_T\\bigr)$$

**Oxygen Update**

> Diffusion - advection + surface reaeration:
>
> $$O_{2,new} = O_2 + dt\\bigl(D_{O2} \\nabla^2 O_2 - \\text{adv}_{O2} + R\\bigr)$$
>
> where the reaeration term applies only to surface-flagged tiles:
>
> $$R = \\begin{cases} k_{gas}\\bigl(\\text{sat}(T) - O_2\\bigr), & \\text{surface tile} \\\\ 0, & \\text{otherwise} \\end{cases}$$

**Nutrient Update**

> Diffusion + regrowth - advection:

$$N_{new} = N + dt\\bigl(D_{nutrients} \\nabla^2 N + r_{regen} - \\text{adv}_N\\bigr)$$

> For non-water tiles the result is forced to zero and nutrient_regen is cleared.

**Light Attenuation (Beer-Lambert)**

> Sun rays are cast through the grid. For each spectral band $i$, intensity decays exponentially with water depth $d$:

$$I_i(d) = I_{surface,i} e^{-\\varepsilon_i d}$$

> with per-band extinction coefficients:

$$\\varepsilon = [0.25, 0.20, 0.15, 0.10, 0.12, 0.18, 0.25, 0.35]$$

> Solid tiles block rays entirely.

**Pheromone / Signal Diffusion**

> Signal concentration at a tile diffuses to the 4 cardinal neighbors and decays multiplicatively. Solids act as reflective/no-flux boundaries:

$$c_{new} = \\max\\Bigl(\\bigl(c + (\\nabla^2 c) D_{signal}\\bigr) \\gamma_{decay}, 0\\Bigr)$$

> with:

\`\`\`rust
SIGNAL_DIFFUSE = 0.12
SIGNAL_DECAY   = 0.98
\`\`\`

In short: the grid solves coupled diffusion-advection equations for heat, oxygen, and nutrients, adds buoyancy-driven vertical flow, applies a spectral Beer-Lambert light model, and overlays a separate diffusing-decaying signal field for creature pheromones.`,
  },
  {
    slug: 'devlog-0-biogenesis',
    title: 'Devblog 0 - Biogenesis!',
    date: '2026-07-06',
    excerpt:
      'The origin story of EvolutionSim: from chemical evolution and first principles simulation to a neural network-driven creature simulator inspired by Factorio and Oxygen Not Included.',
    content: `I wanted to document my process for developing my side project - EvolutionSim. The name will most likely change, but that's what it is for now. I want to explain my thought processes, document my journey, etc.

The idea for a simulation started when learning about what modern scientists call "chemical evolution", or the idea that the first creatures were little more than a bundle of chemicals who's potential energy sat lower than the rest of the chemical soup around them, and as such were stable. Enough of these different stable-ish chemical compounds were made that a couple of them happened to be in the form similar to a DNA strand - one side of the chemical matches well with another. (While obviously being orders of magnitude less complex) Only this time, the mirror match was a copy of the original molecule. This, in turn, created a linear growth rate for these molecular creatures - and simultaneously created an ecosystem where different molecules would "compete" for the primitive building blocks. The building blocks, like simple amino acids and such, are known to spontaneously generate in early Earth-like conditions, see the [Miller-Urey Experiment](https://en.wikipedia.org/wiki/Miller%E2%80%93Urey_experiment) for more info.

This got me thinking: if we understand molecules down to the atomic level, have proven we can simulate their interactions via equations like Van Der Walls (London, Debye, Keesom), understand macro-molecular interactions through good old Gibbs Free Energy, what's stopping us from simulating the entire evolutionary world from the ground up based on on first principles?

I quickly learned why - the computational cost is enormous. At minimum, the simulation scales with O(n), and at worst O(n^2). With baseline mathematics and a simulation size of billions of atoms (approximately 0.000000000000166% of a mole), and you get simulation times that are longer than I'm willing to sit around for. Plus, I don't want to see a couple of carbon atoms linking together, I want to see cellular life. I want to see evolutionary behaviors emerging from competing species. So I scrapped the idea of a ground up simulation and set my sights on something a bit leaner - a simple simulation where creatures driven by neural networks grow and evolve in a simulation, competing for resources and food.

I play lots of simulator games, two of my favorite being Factorio and Oxygen Not Included. The former boasts millions of calculations per second, an extremely polished user experience, and quality of life upgrades you didn't know you wanted; the second a thermal, pressure, germ, liquid, and technology sim management game that makes any engineer happy - with the noticeable exception that large bases run fairly poor on my home-made pc (I was not alone in my gripes against performance). The entire game is designed on real world constants - the thermal system is calculated in kelvin, pressures are in atmospheres, and thermal conductivity between tiles are calculated via real-world coefficients. It's a blast.

So I set my sights on my goal: a game with the same C++ optimized pipeline like factorio, but infused with real world coefficients driving a realistic environment where creatures can adapt, survive (or die), and evolve.

And so I began.`,
  },
];

export function getPostBySlug(slug: string): EvolutionSimPost | undefined {
  return evolutionSimPosts.find((post) => post.slug === slug);
}
