import { Attackers, EnemyTroops, ResearchState, SpecialItems } from './types';

// Types for optimization
export interface OptimizationConfig {
  attackers: Attackers;
  defender: {
    terrain: 'camp' | 'forest' | 'savanna' | 'lake' | 'mountain' | 'hills' | 'plains' | 'enemy';
    level: number;
  };
  enemyTroops: EnemyTroops;
  research: ResearchState;
  enemyResearch?: ResearchState;
  enemyWallLevel?: number;
  specialItems: SpecialItems;
  selectedTroopType: string;
  rngOverride: string;
  seed: number;
}

export interface OptimizationResult {
  success: boolean;
  minimumTroops?: number;
  message: string;
  log: string[];
}

// Count-based battle result interface
export interface BattleResult {
  wonBattle: boolean;
  hasZeroLosses: boolean;
  initialAttackerCount: number;
  finalAttackerCount: number;
  battleLog: string;
}

// Simulate battle and return count-based results
export const simulateBattleForOptimization = (
  config: OptimizationConfig,
  testTroopCount: number,
  specificDefenderLevel?: number
): BattleResult => {
  // Create test attackers with only the selected troop type
  const testAttackers: Attackers = {
    porter: 0,
    conscript: 0,
    spy: 0,
    halberdier: 0,
    minotaur: 0,
    longbowMan: 0,
    swiftStrikeDragon: 0,
    armoredTransport: 0,
    giant: 0,
    fireMirror: 0,
    battleDragon: 0,
  };
  testAttackers[config.selectedTroopType as keyof Attackers] = testTroopCount;

  // Get defender troops
  let defenderTroops: EnemyTroops | null = null;
  if (config.defender.terrain === 'enemy') {
    defenderTroops = config.enemyTroops;
  } else {
    // Get the specific level troops for calculate all
    const levelToUse = specificDefenderLevel !== undefined ? specificDefenderLevel : config.defender.level;
    const terrainTroops = (globalThis as any).ENEMY_COMPOSITIONS?.[config.defender.terrain];
    if (terrainTroops) {
      defenderTroops = terrainTroops[levelToUse.toString()];
    }
  }

  if (!defenderTroops) {
    return {
      wonBattle: false,
      hasZeroLosses: false,
      initialAttackerCount: testTroopCount,
      finalAttackerCount: 0,
      battleLog: "ERROR: Could not determine defender troops"
    };
  }

  // Call the battle simulation (this would need to be imported)
  const battleResult = (globalThis as any).simulateBattle?.(
    testAttackers,
    defenderTroops,
    config.research,
    false, // showDebug
    config.rngOverride,
    config.seed,
    config.defender.terrain === 'enemy' ? config.enemyResearch : undefined,
    config.defender.terrain === 'enemy' ? config.enemyWallLevel : undefined,
    false, // showEnemyStats
    false  // showAttackMath
  );

  if (!battleResult) {
    return {
      wonBattle: false,
      hasZeroLosses: false,
      initialAttackerCount: testTroopCount,
      finalAttackerCount: 0,
      battleLog: "ERROR: Battle simulation failed"
    };
  }

  // Parse battle results using count-based approach
  const wonBattle = battleResult.includes("The attackers have won the battle");
  const finalForcesStart = battleResult.indexOf("=== FINAL FORCES ===");
  
  let finalAttackerCount = 0;
  let hasZeroLosses = false;
  
  if (wonBattle && finalForcesStart !== -1) {
    const finalForcesSection = battleResult.substring(finalForcesStart);
    const attackerLines = finalForcesSection.split('\n').filter(line => 
      line.includes('text-green-400">Attacker</span>:')
    );
    
    // Count the total remaining attackers using the new count system
    finalAttackerCount = attackerLines.reduce((total, line) => {
      const match = line.match(/(\d+)x\s+(.+)/);
      if (match) {
        const count = parseInt(match[1]);
        return total + count;
      }
      return total;
    }, 0);
    
    // Check if we have zero losses using the count system
    // Initial count is the testTroopCount, final count is the sum of remaining attackers
    hasZeroLosses = finalAttackerCount === testTroopCount;
  }

  return {
    wonBattle,
    hasZeroLosses,
    initialAttackerCount: testTroopCount,
    finalAttackerCount,
    battleLog: battleResult
  };
};

// Find minimum troops needed for zero losses
export const findMinimumTroops = async (
  config: OptimizationConfig,
  onProgress?: (log: string) => void
): Promise<OptimizationResult> => {
  const optimizationLog: string[] = [];
  
  const log = (message: string) => {
    optimizationLog.push(message);
    onProgress?.(message);
  };

  log(`=== OPTIMIZATION RESULTS ===`);
  log(`Finding minimum ${(globalThis as any).TROOP_STATS?.[config.selectedTroopType]?.name || config.selectedTroopType} count for zero losses...`);
  log(`Target: ${config.defender.terrain.charAt(0).toUpperCase() + config.defender.terrain.slice(1)} Level ${config.defender.level}`);
  log(`RNG Override: ${config.rngOverride || 'Random'}`);
  log(`Seed: ${config.seed}`);
  log("");

  // Binary search setup
  let low = 1;
  let high = 100000; // Start with a reasonable upper bound
  let result = -1;
  let testCount = 0;
  const maxTests = 20; // Prevent infinite loops

  // First, find an upper bound that works
  let foundWorkingHigh = false;
  while (high <= 10000000 && !foundWorkingHigh) {
    testCount++;
    
    const battleResult = simulateBattleForOptimization(config, high);
    
    // Debug output for first few tests
    if (testCount <= 3) {
      log(`DEBUG: Testing ${high} troops`);
      log(`DEBUG: Won battle: ${battleResult.wonBattle}`);
      log(`DEBUG: Has zero losses: ${battleResult.hasZeroLosses}`);
      log(`DEBUG: Initial count: ${battleResult.initialAttackerCount}, Final count: ${battleResult.finalAttackerCount}`);
      log(`DEBUG: Count system: ${battleResult.finalAttackerCount === battleResult.initialAttackerCount ? 'ZERO LOSSES' : 'HAS LOSSES'}`);
    }

    if (battleResult.hasZeroLosses) {
      foundWorkingHigh = true;
      log(`Found working upper bound: ${high}`);
    } else {
      high *= 2;
      if (testCount >= 5) {
        high = 10000000;
        foundWorkingHigh = true;
        log(`Using maximum upper bound: ${high}`);
      }
    }
  }

  if (!foundWorkingHigh) {
    log("❌ No minimum found within reasonable limits");
    log("Try increasing the upper bound or using different troops/research");
    return {
      success: false,
      message: "No minimum found within reasonable limits",
      log: optimizationLog
    };
  }

  // Binary search for minimum
  log(`Starting binary search between ${low} and ${high}`);
  while (low <= high && testCount < maxTests) {
    testCount++;
    const mid = Math.floor((low + high) / 2);

    const battleResult = simulateBattleForOptimization(config, mid);
    
    // Debug output for first few tests
    if (testCount <= 6) {
      log(`DEBUG: Binary search test ${testCount}: Testing ${mid} troops`);
      log(`DEBUG: Won battle: ${battleResult.wonBattle}`);
      log(`DEBUG: Has zero losses: ${battleResult.hasZeroLosses}`);
      log(`DEBUG: Initial count: ${battleResult.initialAttackerCount}, Final count: ${battleResult.finalAttackerCount}`);
      log(`DEBUG: Count system: ${battleResult.finalAttackerCount === battleResult.initialAttackerCount ? 'ZERO LOSSES' : 'HAS LOSSES'}`);
      log(`DEBUG: Current range: ${low}-${high}`);
    }

    if (battleResult.hasZeroLosses) {
      result = mid;
      high = mid - 1;
      log(`Found zero losses at ${mid}, searching lower...`);
    } else {
      low = mid + 1;
      log(`No zero losses at ${mid}, searching higher...`);
    }

    // Add small delay for UI responsiveness
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  log("");
  
  if (result > 0) {
    log(`🎯 MINIMUM FOUND: ${result.toLocaleString()}x ${(globalThis as any).TROOP_STATS?.[config.selectedTroopType]?.name || config.selectedTroopType}`);
    return {
      success: true,
      minimumTroops: result,
      message: `Found minimum: ${result.toLocaleString()} troops`,
      log: optimizationLog
    };
  } else {
    log(`❌ No minimum found within reasonable limits`);
    log(`Try increasing the upper bound or using different troops/research`);
    return {
      success: false,
      message: "No minimum found within reasonable limits",
      log: optimizationLog
    };
  }
};

// Calculate all optimization results for research levels 1-10 and target levels 1-10
// Calculate modified stats for attacking units based on research and special items
export const calculateAttackerStats = (
  unitType: keyof any, 
  research: ResearchState, 
  specialItems: SpecialItems,
  TROOP_STATS: Record<string, any>
) => {
  const unit = TROOP_STATS[unitType];
  if (!unit) return { attack: 0, defense: 0, health: 0 };

  // Base values
  let attack = unit.attack;
  let defense = unit.defense;
  let health = unit.health;

  // Calculate research bonuses
  const metalurgyBonus = research.metalurgy * 0.05;
  const medicineBonus = research.medicine * 0.05;
  const weaponsCalibrationBonus = research.weaponsCalibration * 0.05;
  const rapidDeploymentBonus = (research.rapidDeployment || 1) * 0.05;
  
  // Dragon-specific bonuses
  const isDragon = unit.type === 'dragon';
  const dragonryBonus = isDragon ? research.dragonry * 0.10 : 0;
  
  // Ranged unit bonuses (include both ranged and siege units)
  const isRanged = unit.type === 'ranged' || unit.type === 'siege';
  const rangeBonus = isRanged ? weaponsCalibrationBonus : 0;

  // Calculate attack with all bonuses
  let attackBonus = metalurgyBonus;
  
  // Apply special items
  if (specialItems.dragonHeart) attackBonus += 0.20; // +20% attack for all troops
  
  // Apply attack bonuses
  attack = Math.round(attack * (1 + attackBonus));
  
  // Calculate defense with all bonuses
  let defenseBonus = metalurgyBonus;
  if (specialItems.glowingShields) defenseBonus += 0.20; // +20% defense for all troops
  if (specialItems.purpleBones && isDragon) defenseBonus += 1.00; // +100% defense for dragons only
  
  defense = Math.round(defense * (1 + defenseBonus));
  
  // Calculate health with all bonuses
  let healthBonus = medicineBonus;
  
  health = Math.round(health * (1 + healthBonus));
  
  // Calculate speed with dragonry bonus for dragons and rapid deployment for all units
  let speedBonus = rapidDeploymentBonus; // +5% speed per level for all units
  if (isDragon) speedBonus += research.dragonry * 0.10; // +10% speed per level for dragons
  
  const speed = Math.round(unit.speed * (1 + speedBonus));
  
  // Calculate range bonus for ranged units
  const range = isRanged ? Math.round(unit.range * (1 + rangeBonus)) : 0;
  
  // Calculate ranged attack for ranged units
  let rangedAttack = 0;
  if (isRanged) {
    rangedAttack = Math.round(unit.rangedAttack * (1 + attackBonus));
  }
  
  // Apply Crimson Bull bonus to dragon attack (both melee and ranged)
  if (specialItems.crimsonBull && isDragon) {
    attack = Math.round(attack * 1.20); // +20% attack for dragons
    if (isRanged) {
      rangedAttack = Math.round(rangedAttack * 1.20); // +20% ranged attack for dragons
    }
  }

  return {
    attack,
    defense,
    health,
    range: isRanged ? range : undefined,
    rangedAttack: isRanged ? rangedAttack : undefined,
    speed: speed, // Speed now includes dragonry bonus for dragons
    load: unit.load    // Load capacity is not modified by research/items in current spec
  };
};

// Calculate all optimization results for research levels 1-10 and target levels 1-10
export const calculateAllOptimizations = async (
  config: Omit<OptimizationConfig, 'research'>,
  onProgress?: (message: string) => void
): Promise<string> => {
  // Get all troop types (exclude porter as it's not a combat unit)
  const troopTypes = Object.keys((globalThis as any).TROOP_STATS || {}).filter((troop: string) => 
    troop !== 'porter' && (globalThis as any).TROOP_STATS[troop]?.attack > 0
  );

  // Get defender compositions for all levels
  const terrainTroops = (globalThis as any).ENEMY_COMPOSITIONS?.[config.defender.terrain];
  if (!terrainTroops) {
    return '<div class="text-red-400">❌ ERROR: Could not determine terrain compositions</div>';
  }

  let htmlOutput = '<div class="space-y-8">';
  
  // Add header info
  htmlOutput += `
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-white mb-2">Calculate All Results</h3>
      <p class="text-gray-400">Target: ${config.defender.terrain.charAt(0).toUpperCase() + config.defender.terrain.slice(1)} (Levels 1-10)</p>
      <p class="text-gray-400">RNG Override: ${config.rngOverride || 'Random'} | Seed: ${config.seed}</p>
    </div>
  `;

  // Create table for each research level (1-10)
  for (let researchLevel = 1; researchLevel <= 10; researchLevel++) {
    onProgress?.(`Calculating for research level ${researchLevel}...`);
    
    htmlOutput += `
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-white mb-3">Research Level ${researchLevel}</h4>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-gray-600">
                <th class="border border-gray-500 px-3 py-2 text-left font-medium">Level</th>
    `;
    
    // Add troop type headers
    troopTypes.forEach((troopType: string) => {
      const troopName = (globalThis as any).TROOP_STATS[troopType]?.name || troopType;
      htmlOutput += `<th class="border border-gray-500 px-3 py-2 text-left font-medium">${troopName}</th>`;
    });
    
    htmlOutput += `
              </tr>
            </thead>
            <tbody>
    `;

    // Calculate for each target level (1-10)
    for (let targetLevel = 1; targetLevel <= 10; targetLevel++) {
      const defenderTroops = terrainTroops[targetLevel.toString()];
      if (!defenderTroops) continue;

      htmlOutput += `<tr class="${targetLevel % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}">`;
      htmlOutput += `<td class="border border-gray-500 px-3 py-2 font-medium">${targetLevel}</td>`;
      
      // Test each troop type
      for (const troopType of troopTypes) {
        const researchState = {
          metalurgy: researchLevel,
          dragonry: researchLevel,
          medicine: researchLevel,
          weaponsCalibration: researchLevel,
          rapidDeployment: researchLevel
        };

        // Find minimum troops for this combination
        let minTroops = "Not Possible";
        let low = 1;
        let high = 100000;
        let found = false;

        // Find upper bound
        while (high <= 10000000 && !found) {
          const testConfig = {
            ...config,
            research: researchState,
            selectedTroopType: troopType
          };
          
          const battleResult = simulateBattleForOptimization(testConfig, high, targetLevel);

          if (battleResult.hasZeroLosses) {
            found = true;
          } else {
            high *= 2;
            if (high > 10000000) break;
          }
        }

        if (found) {
          // Binary search for minimum
          let result = -1;
          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            
            const testConfig = {
              ...config,
              research: researchState,
              selectedTroopType: troopType
            };
            
            const battleResult = simulateBattleForOptimization(testConfig, mid, targetLevel);

            if (battleResult.hasZeroLosses) {
              result = mid;
              high = mid - 1;
            } else {
              low = mid + 1;
            }
          }

          if (result > 0) {
            minTroops = result.toLocaleString();
          }
        }

        // Style the cell based on the value
        let cellClass = "border border-gray-500 px-3 py-2 text-center ";
        if (minTroops === "Not Possible") {
          cellClass += "text-red-400";
        } else {
          const numValue = parseInt(minTroops.replace(/,/g, ''));
          if (numValue <= 10000) {
            cellClass += "text-green-400";
          } else if (numValue <= 50000) {
            cellClass += "text-yellow-400";
          } else {
            cellClass += "text-orange-400";
          }
        }

        htmlOutput += `<td class="${cellClass}">${minTroops}</td>`;
      }
      
      htmlOutput += '</tr>';
    }

    htmlOutput += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  htmlOutput += `
    <div class="text-center mt-8 text-gray-400">
      <p>✅ All calculations completed!</p>
      <p class="text-sm">💡 Tip: Use this data to plan your research progression and troop requirements.</p>
    </div>
  </div>
    `;

  return htmlOutput;
};
