import { EnemyComposition, EnemyTroops } from './types';

// Enemy Troop Compositions
const CAMP_TROOPS: EnemyComposition = {
  '1': { porter: 1500, conscript: 500 },
  '2': { porter: 3000, conscript: 1000, spy: 500, halberdier: 1000 },
  '3': { porter: 6000, conscript: 2000, spy: 1000, halberdier: 2000, minotaur: 1000 },
  '4': { porter: 15000, conscript: 5000, spy: 2000, halberdier: 4000, minotaur: 2000, longbowMan: 1500 },
  '5': { porter: 30000, conscript: 10000, spy: 5000, halberdier: 10000, minotaur: 4000, longbowMan: 3000, swiftStrikeDragon: 2000 },
  '6': { porter: 45000, conscript: 15000, spy: 10000, halberdier: 20000, minotaur: 15000, longbowMan: 10000, swiftStrikeDragon: 4000 },
  '7': { porter: 90000, conscript: 30000, spy: 15000, halberdier: 30000, minotaur: 20000, longbowMan: 15000, swiftStrikeDragon: 8000, battleDragon: 2000 },
  '8': { porter: 180000, conscript: 60000, spy: 30000, halberdier: 60000, minotaur: 30000, longbowMan: 30000, swiftStrikeDragon: 20000, battleDragon: 4000 },
  '9': { porter: 350000, conscript: 120000, spy: 60000, halberdier: 120000, minotaur: 60000, longbowMan: 45000, swiftStrikeDragon: 40000, battleDragon: 8000, giant: 5000 },
  '10': { porter: 750000, conscript: 250000, spy: 120000, halberdier: 250000, minotaur: 120000, longbowMan: 90000, swiftStrikeDragon: 60000, battleDragon: 16000, giant: 10000, fireMirror: 10000 }
};

const WILDS_TROOPS: EnemyComposition = {
  '1': { porter: 0, conscript: 50 },
  '2': { porter: 0, conscript: 100, spy: 50 },
  '3': { porter: 0, conscript: 200, spy: 100, halberdier: 100 },
  '4': { porter: 0, conscript: 500, spy: 200, halberdier: 200, minotaur: 100 },
  '5': { porter: 0, conscript: 1000, spy: 500, halberdier: 400, minotaur: 200, longbowMan: 150 },
  '6': { porter: 0, conscript: 2000, spy: 1000, halberdier: 1000, minotaur: 400, longbowMan: 300, swiftStrikeDragon: 200 },
  '7': { porter: 0, conscript: 3500, spy: 1250, halberdier: 1250, minotaur: 600, longbowMan: 400, swiftStrikeDragon: 250 },
  '8': { porter: 0, conscript: 5000, spy: 2000, halberdier: 2000, minotaur: 1000, longbowMan: 600, swiftStrikeDragon: 400 },
  '9': { porter: 0, conscript: 10000, spy: 5000, halberdier: 4000, minotaur: 2000, longbowMan: 1500, swiftStrikeDragon: 800, giant: 250 },
  '10': { porter: 0, conscript: 20000, spy: 10000, halberdier: 10000, minotaur: 4000, longbowMan: 3000, swiftStrikeDragon: 2000, giant: 500, fireMirror: 500 }
};

export const ENEMY_COMPOSITIONS = {
  // Camp has unique troops per level
  camp: CAMP_TROOPS,
  
  // All wilds share the same troop counts but have different level progressions
  forest: WILDS_TROOPS,
  savanna: WILDS_TROOPS,
  lake: WILDS_TROOPS,
  mountain: WILDS_TROOPS,
  hills: WILDS_TROOPS,
  plains: WILDS_TROOPS,
  
  // Enemy is player-specific
  enemy: null
} as const;

// Helper function to get composition as formatted string
export const getCompositionString = (troops: EnemyTroops): string => {
  return Object.entries(troops)
    .map(([unit, count]) => `${count.toLocaleString()} ${unit}`)
    .join(', ');
};
