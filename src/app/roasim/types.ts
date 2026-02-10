export interface SpecialItems {
  crimsonBull: boolean;
  glowingShields: boolean;
  purpleBones: boolean;
  dragonHeart: boolean;
}

export interface Attackers {
  porter: number;
  conscript: number;
  spy: number;
  halberdier: number;
  minotaur: number;
  longbowMan: number;
  swiftStrikeDragon: number;
  armoredTransport: number;
  giant: number;
  fireMirror: number;
  battleDragon: number;
}

export type TerrainType = 'camp' | 'forest' | 'savanna' | 'lake' | 'mountain' | 'hills' | 'plains' | 'enemy';

export interface DefenderState {
  terrain: TerrainType;
  level: number;
}

export interface EnemyResearch {
  weaponsCalibration: number;
  metalurgy: number;
  medicine: number;
  dragonry: number;
  rapidDeployment: number;
}

export type ResearchState = EnemyResearch;

export interface EnemyTroops {
  porter: number;
  conscript: number;
  spy: number;
  halberdier: number;
  minotaur: number;
  longbowMan: number;
  swiftStrikeDragon: number;
  armoredTransport: number;
  giant: number;
  fireMirror: number;
  battleDragon: number;
}

export interface TroopStats {
  name: string;
  tier: number;
  type: 'infantry' | 'ranged' | 'cavalry' | 'dragon' | 'siege';
  attack: number;
  defense: number;
  health: number;
  speed: number;
  load: number;
  upkeep: number;
  range: number;           // Attack range (0 for melee)
  rangedAttack: number;    // Ranged attack power (0 for melee-only units)
  power: number;           // Overall power rating for quick comparison
}

export interface EnemyComposition {
  [level: string]: EnemyTroops;
}
