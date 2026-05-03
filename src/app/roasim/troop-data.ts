import { TroopStats } from './types';

// Troop Stats Data
export const TROOP_STATS: Record<string, TroopStats> = {
  // Tier 1
  porter: {
    name: 'Porter', tier: 1, type: 'infantry',
    attack: 1, rangedAttack: 0, health: 45, defense: 10, speed: 100, range: 0, load: 200, upkeep: 2, power: 1
  },
  conscript: {
    name: 'Conscript', tier: 1, type: 'infantry',
    attack: 10, rangedAttack: 0, health: 75, defense: 10, speed: 200, range: 0, load: 20, upkeep: 3, power: 1
  },
  spy: {
    name: 'Spy', tier: 1, type: 'infantry',
    attack: 5, rangedAttack: 0, health: 10, defense: 5, speed: 150, range: 0, load: 0, upkeep: 5, power: 2
  },
  halberdier: {
    name: 'Halberdier', tier: 1, type: 'infantry',
    attack: 40, rangedAttack: 0, health: 150, defense: 40, speed: 300, range: 0, load: 40, upkeep: 6, power: 2
  },
  minotaur: {
    name: 'Minotaur', tier: 3, type: 'infantry',
    attack: 70, rangedAttack: 0, health: 225, defense: 45, speed: 275, range: 0, load: 30, upkeep: 7, power: 3
  },
  longbowMan: {
    name: 'Longbow Man', tier: 2, type: 'ranged',
    attack: 5, rangedAttack: 80, health: 75, defense: 30, speed: 250, range: 1200, load: 25, upkeep: 9, power: 4
  },
  swiftStrikeDragon: {
    name: 'Swift Strike Dragon', tier: 4, type: 'dragon',
    attack: 150, rangedAttack: 0, health: 300, defense: 60, speed: 1000, range: 0, load: 100, upkeep: 18, power: 5
  },
  armoredTransport: {
    name: 'Armored Transport', tier: 3, type: 'siege',
    attack: 5, rangedAttack: 0, health: 750, defense: 200, speed: 150, range: 0, load: 5000, upkeep: 10, power: 6
  },
  giant: {
    name: 'Giant', tier: 4, type: 'infantry',
    attack: 1000, rangedAttack: 0, health: 4000, defense: 400, speed: 120, range: 0, load: 45, upkeep: 100, power: 9
  },
  fireMirror: {
    name: 'Fire Mirror', tier: 4, type: 'siege',
    attack: 20, rangedAttack: 1200, health: 1500, defense: 30, speed: 50, range: 1500, load: 75, upkeep: 250, power: 10
  },
  battleDragon: {
    name: 'Battle Dragon', tier: 4, type: 'dragon',
    attack: 300, rangedAttack: 0, health: 1500, defense: 300, speed: 750, range: 0, load: 80, upkeep: 35, power: 7
  },
  fangtooth: {
    name: 'Fangtooth', tier: 4, type: 'infantry',
    attack: 1600, rangedAttack: 800, health: 3000, defense: 300, speed: 500, range: 600, load: 45, upkeep: 125, power: 10
  },
  // Add more troops as needed
};
