'use client';

import { useState } from 'react';
import Head from 'next/head';

interface SpecialItems {
  crimsonBull: boolean;
  glowingShields: boolean;
  purpleBones: boolean;
  dragonHeart: boolean;
}

interface Attackers {
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

type TerrainType = 'camp' | 'forest' | 'savanna' | 'lake' | 'mountain' | 'hills' | 'plains' | 'enemy';

interface DefenderState {
  terrain: TerrainType;
  level: number;
}

const ROASim = () => {
  const [attackers, setAttackers] = useState<Attackers>({
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
  });

  const [formData, setFormData] = useState({
    weaponsCalibration: 1,
    metalurgy: 1,
    medicine: 1,
    rapidDeployment: 1,
    dragonry: 1,
  });
  
  const [specialItems, setSpecialItems] = useState<SpecialItems>({
    crimsonBull: false,
    glowingShields: false,
    purpleBones: false,
    dragonHeart: false,
  });
  
  const [defender, setDefender] = useState<DefenderState>({
    terrain: 'camp',
    level: 1
  });
  
  const [result, setResult] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000000));
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, dataset } = e.target;
    
    if (type === 'checkbox') {
      setSpecialItems(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (dataset?.section === 'attackers') {
      setAttackers(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else if (name === 'terrain') {
      setDefender(prev => ({
        ...prev,
        terrain: value as TerrainType,
        level: value === 'enemy' ? 0 : (prev.terrain === 'enemy' ? 1 : prev.level) // Keep current level unless switching to/from enemy
      }));
    } else if (name === 'defenderLevel') {
      setDefender(prev => ({
        ...prev,
        level: Math.min(Math.max(parseInt(value) || 1, 1), 10) // Ensure level is between 1-10
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
  };
  
  interface BattleUnit {
  id: string;
  type: string;
  count: number;
  attack: number;
  defense: number;
  health: number;
  range: number;
  rangedAttack: number;
  speed: number;
  position: number;
  isAttacker: boolean;
  hasMoved: boolean;
  hasAttacked: boolean;
}

const simulateBattle = (attackers: Attackers, defenders: EnemyTroops, researchState: ResearchState) => {
  // Initialize battle log
  const battleLog: string[] = [];
  
  // Calculate modified stats for all attacker units
  const attackerModifiedStats = Object.fromEntries(
    Object.entries(attackers)
      .filter(([_, count]) => count > 0)
      .map(([unitType]) => [
        unitType, 
        calculateAttackerStats(unitType, formData, specialItems)
      ])
  );

  // Helper function to safely get range
  const getUnitRange = (unitType: string, isAttacker: boolean = false): number => {
    const stats = isAttacker 
      ? attackerModifiedStats[unitType] || TROOP_STATS[unitType]
      : TROOP_STATS[unitType];
    return stats?.range || 0;
  };

  // Find the highest range in attacker's army using modified stats
  const maxAttackerRange = Math.max(
    ...Object.entries(attackers)
      .filter(([_, count]) => count > 0)
      .map(([unitType]) => getUnitRange(unitType, true)),
    1 // Minimum range of 1 to prevent NaN issues
  );

  // Find the highest range in defender's army (defenders don't get research bonuses)
  const maxDefenderRange = Math.max(
    ...Object.entries(defenders)
      .filter(([_, count]) => count > 0)
      .map(([unitType]) => getUnitRange(unitType)),
    1 // Minimum range of 1 to prevent NaN issues
  );

  // Determine the battlefield range - can be 0 for melee combat
  const battlefieldRange = Math.max(0, maxAttackerRange, maxDefenderRange);
  
  // Log the battlefield range determination
  const determiningUnits: string[] = [];
  if (battlefieldRange > 0) {
    if (maxAttackerRange === battlefieldRange) {
      const attackerUnits = Object.entries(attackerModifiedStats)
        .filter(([_, stats]) => stats.range === battlefieldRange)
        .map(([unitType]) => TROOP_STATS[unitType]?.name || unitType);
      if (attackerUnits.length > 0) {
        determiningUnits.push(`Attackers (${attackerUnits.join(', ')})`);
      }
    }
    
    if (maxDefenderRange === battlefieldRange) {
      const defenderUnits = Object.entries(defenders)
        .filter(([unitType, count]) => count > 0 && TROOP_STATS[unitType]?.range === battlefieldRange)
        .map(([unitType]) => TROOP_STATS[unitType]?.name || unitType);
      if (defenderUnits.length > 0) {
        determiningUnits.push(`Defenders (${defenderUnits.join(', ')})`);
      }
    }
  }
  
  // Initialize units for battle
  const battleUnits: BattleUnit[] = [];
  
  // Track which units are attackers and which are defenders
  const attackerUnits: BattleUnit[] = [];
  const defenderUnits: BattleUnit[] = [];

  // Add attackers with modified stats
  Object.entries(attackers).forEach(([unitType, count]) => {
    if (count > 0) {
      const baseStats = TROOP_STATS[unitType];
      const modifiedStats = attackerModifiedStats[unitType] || baseStats;
      
      const battleUnit = {
        id: `${unitType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: unitType,
        count,
        attack: modifiedStats.attack,
        defense: modifiedStats.defense,
        health: modifiedStats.health,
        range: modifiedStats.range,
        rangedAttack: modifiedStats.rangedAttack || 0, // Ensure rangedAttack is defined
        speed: baseStats.speed, // Speed isn't modified by research
        position: 0, // Start at attacker's side (position 0)
        isAttacker: true,
        hasMoved: false,
        hasAttacked: false
      };
      battleUnits.push(battleUnit);
      attackerUnits.push(battleUnit);
    }
  });

  // Add defenders with proper stats
  Object.entries(defenders).forEach(([unitType, count]) => {
    if (count > 0) {
      const unit = TROOP_STATS[unitType];
      const battleUnit: BattleUnit = {
        id: `${unitType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: unitType,
        count,
        attack: unit.attack,
        defense: unit.defense,
        health: unit.health,
        range: unit.range || 0,
        rangedAttack: unit.rangedAttack || 0,
        speed: unit.speed,
        position: battlefieldRange,
        isAttacker: false,
        hasMoved: false,
        hasAttacked: false
      };
      
      // In melee combat, all units start at position 0
      if (battlefieldRange === 0) {
        battleUnit.position = 0;
      }
      
      battleUnits.push(battleUnit);
      defenderUnits.push(battleUnit);
    }
  });

  // Sort units by speed (highest first)
  const sortedUnits = [...battleUnits].sort((a, b) => {
    return TROOP_STATS[b.type].speed - TROOP_STATS[a.type].speed;
  });

  // Add initial battle setup to the log
  battleLog.push("Battle Setup:");
  battleLog.push(`- Battlefield length: ${battlefieldRange}`);
  battleLog.push(`- Random seed: ${seed}`);
  
  // Add attacker's army composition
  const attackerArmy = Object.entries(attackers)
    .filter(([_, count]) => count > 0)
    .map(([unitType, count]) => `${count.toLocaleString()}x ${TROOP_STATS[unitType].name}`)
    .join(', ');
  
  battleLog.push(`- Attacker's Army: ${attackerArmy}`);
  
  // Add defender's army composition
  const defenderArmy = Object.entries(defenders)
    .filter(([_, count]) => count > 0)
    .map(([unitType, count]) => `${count.toLocaleString()}x ${TROOP_STATS[unitType].name}`)
    .join(', ');
    
  battleLog.push(`- Defender's Army: ${defenderArmy}`);
  
  // Show attacker's modified stats
  battleLog.push("\nAttacker's Modified Stats:");
  const research = researchState; // Use the research state from the component
  Object.entries(attackers).forEach(([unitType, count]) => {
    if (count > 0) {
      const baseStats = TROOP_STATS[unitType];
      const modifiedStats = calculateAttackerStats(unitType, research, specialItems);
      battleLog.push(`- ${baseStats.name}:`);
      battleLog.push(`  Attack: ${baseStats.attack} → ${modifiedStats.attack}`);
      battleLog.push(`  Defense: ${baseStats.defense} → ${modifiedStats.defense}`);
      battleLog.push(`  Health: ${baseStats.health} → ${modifiedStats.health}`);
      if (baseStats.range > 0) {
        battleLog.push(`  Range: ${baseStats.range} → ${modifiedStats.range}`);
      }
      if (baseStats.rangedAttack > 0) {
        battleLog.push(`  Ranged Attack: ${baseStats.rangedAttack} → ${modifiedStats.rangedAttack}`);
      }
    }
  });
  
  // Log which units set the battlefield length
  if (battlefieldRange > 0) {
    if (determiningUnits.length > 0) {
      battleLog.push(`Battlefield length set to ${battlefieldRange} by ${determiningUnits.join(' and ')}`);
    } else {
      battleLog.push(`Battlefield length set to ${battlefieldRange}`);
    }
  } else {
    battleLog.push("Melee combat only (battlefield length: 0)");
  }
  battleLog.push(""); // Empty line for spacing
  
  // Initialize round counter and turn counter for RNG
  let round = 0;
  let turnCounter = 0;
  const maxRounds = 20; // Prevent infinite loops
  
  // Main battle loop
  while (round < maxRounds) {
    round++;
    battleLog.push(`=== ROUND ${round} ===`);
    
    // Reset unit states for new round
    battleUnits.forEach(unit => {
      unit.hasMoved = false;
      unit.hasAttacked = false;
    });
    
    // Sort units by speed (fastest first) for this round
    const sortedUnits = [...battleUnits]
      .filter(unit => unit.count > 0) // Only living units
      .sort((a, b) => TROOP_STATS[b.type].speed - TROOP_STATS[a.type].speed);
    
    // Process each unit's turn
    for (const unit of sortedUnits) {
      if (unit.count <= 0) continue; // Skip dead units
      
      // Reset damage tracking for this unit's turn
      let damageUsedThisTurn = 0;
      const maxDamagePotential = unit.count * (unit.rangedAttack || unit.attack) * 2.1 * 1.2;
      
      const unitStats = TROOP_STATS[unit.type];
      
      // Find potential targets using the unit's actual range
      let potentialTargets = battleUnits.filter(target => {
        if (target.count <= 0) return false; // Skip dead units
        if (unit.isAttacker === target.isAttacker) return false; // Skip same side
        
        const distance = Math.abs(unit.position - target.position);
        
        // Check melee range (1) for all units, regardless of battlefield range
        if (distance <= 1) return true;
        
        // For ranged units, check their attack range
        const attackRange = unit.range || 0;
        return distance <= attackRange;
      });
      
      // Movement phase - only move if there are no potential targets in range
      if (potentialTargets.length === 0 && unit.speed > 0) {
        // Find closest enemy to determine movement direction
        const closestEnemy = battleUnits
          .filter(target => target.count > 0 && target.isAttacker !== unit.isAttacker)
          .sort((a, b) => {
            const posA = Number.isFinite(a.position) ? a.position : 0;
            const posB = Number.isFinite(b.position) ? b.position : 0;
            const unitPos = Number.isFinite(unit.position) ? unit.position : 0;
            const distA = Math.abs(unitPos - posA);
            const distB = Math.abs(unitPos - posB);
            return distA - distB;
          })[0];
          
        if (closestEnemy) {
          const currentPos = Number.isFinite(unit.position) ? unit.position : 0;
          const enemyPos = Number.isFinite(closestEnemy.position) ? closestEnemy.position : 0;
          
          // Determine movement direction based on relative positions
          let moveDirection = unit.isAttacker ? 1 : -1;
          
          // If we're an attacker and have passed the enemy, or a defender and the enemy is to our right
          if ((unit.isAttacker && currentPos > enemyPos) || (!unit.isAttacker && currentPos < enemyPos)) {
            moveDirection *= -1;
          }
          
          // Calculate new position (don't move past battlefield bounds)
          let newPosition = currentPos + (unit.speed * moveDirection);
          
          // For melee combat, move towards the enemy
          if (battlefieldRange === 1) {
            // Move towards position 1 if attacker, position 0 if defender
            newPosition = unit.isAttacker ? 1 : 0;
          } else {
            // Clamp position to battlefield bounds
            newPosition = Math.max(0, Math.min(newPosition, battlefieldRange));
            
            // Find friendly units that might be in the way
            const friendlyUnits = battleUnits.filter(u => 
              u.count > 0 && 
              u.isAttacker === unit.isAttacker && 
              u.id !== unit.id
            );
            
            // Prevent moving past friendly units
            if (unit.isAttacker) {
              const blockingUnit = friendlyUnits
                .filter(u => u.position > currentPos && u.position <= newPosition)
                .sort((a, b) => a.position - b.position)[0];
                
              if (blockingUnit) {
                newPosition = blockingUnit.position - 1; // Stop 1 unit before the friendly unit
              }
            } else {
              const blockingUnit = friendlyUnits
                .filter(u => u.position < currentPos && u.position >= newPosition)
                .sort((a, b) => b.position - a.position)[0];
                
              if (blockingUnit) {
                newPosition = blockingUnit.position + 1; // Stop 1 unit after the friendly unit
              }
            }
            
            // Ensure we don't overshoot the enemy
            if (unit.isAttacker) {
              newPosition = Math.min(newPosition, Math.max(0, enemyPos - 1));
            } else {
              newPosition = Math.max(newPosition, Math.min(battlefieldRange, enemyPos + 1));
            }
          }
          
          // Only move if the position changes and we have movement speed
          if (newPosition !== currentPos && unit.speed > 0) {
            battleLog.push(`${unit.count}x ${TROOP_STATS[unit.type].name} moves from ${currentPos} to ${newPosition}`);
            unit.position = newPosition;
            
            // Recalculate potential targets after moving
            potentialTargets = battleUnits.filter(target => {
              if (target.count <= 0) return false;
              if (unit.isAttacker === target.isAttacker) return false;
              const distance = Math.abs(unit.position - target.position);
              return distance <= (unit.range || 0) || distance <= 1; // Can attack if in range or adjacent
            });
            
            // If we have targets after moving, mark as not moved so we can attack
            if (potentialTargets.length > 0) {
              unit.hasMoved = false;
            }
          }
        }
      }
      
      // Attack phase - only if unit is still alive after movement and has targets
      if (unit.count > 0 && potentialTargets.length > 0) {
        // Keep track of attacks this turn and damage used
        let attacksThisTurn = 0;
        let damageUsedThisTurn = 0;
        const maxAttacks = 10; // Prevent infinite loops
        const maxDamagePotential = unit.count * (unit.rangedAttack || unit.attack) * 2.1 * 1.2;
        
        while (attacksThisTurn < maxAttacks && 
               unit.count > 0 && 
               potentialTargets.length > 0 &&
               damageUsedThisTurn < maxDamagePotential * 0.2) {
          
          attacksThisTurn++;
          
          // Sort targets by lowest health percentage first
          potentialTargets.sort((a, b) => {
            const aHealthPercent = (a.count * a.health) / (TROOP_STATS[a.type].health * Math.max(1, a.count));
            const bHealthPercent = (b.count * b.health) / (TROOP_STATS[b.type].health * Math.max(1, b.count));
            return aHealthPercent - bHealthPercent;
          });

          const target = potentialTargets[0];
          if (target.count <= 0) break;
          
          const targetStats = TROOP_STATS[target.type];
          const isRangedAttack = !!unit.rangedAttack;
          const attackPower = isRangedAttack ? unit.rangedAttack : unit.attack;
          
          // Calculate attack/defense ratio (clamped between 0.3 and 2.1)
          const attackDefenseRatio = Math.min(2.1, Math.max(0.3, attackPower / target.defense));
          
          // Calculate base damage and apply attack/defense ratio
          const baseDamage = attackPower * unit.count;
          
          // Calculate RNG factor (0.8 to 1.2)
          const rngSeed = seed + (round * 10) + (turnCounter);
          const rng = 0.8 + (0.4 * ((rngSeed * 9301 + 49297) % 233280) / 233280);
          
          // Calculate final damage with all factors
          const rawDamage = Math.round(baseDamage * attackDefenseRatio * rng);
          
          // Calculate max possible damage for this attack
          const maxPossibleDamage = attackPower * unit.count * 2.1 * 1.2;
          
          const healthPerUnit = targetStats.health;
          const maxPossibleKills = target.count;
          
          // Calculate actual damage done (capped by remaining unit health)
          const maxDamagePossible = maxPossibleKills * healthPerUnit;
          const actualDamage = Math.min(rawDamage, maxDamagePossible);
          
          // Calculate units killed based on actual damage
          const unitsKilled = Math.min(
            target.count,
            Math.floor(actualDamage / healthPerUnit) || (actualDamage > 0 ? 1 : 0)
          );
          
          // Ensure at least 1 unit is killed if damage is positive and there are units left
          const effectiveUnitsKilled = Math.min(
            target.count,
            Math.max(1, unitsKilled)
          );
          
          // Store target count before damage is applied
          const targetCountBefore = target.count;
          
          // Apply damage
          target.count = Math.max(0, target.count - effectiveUnitsKilled);
          
          // Calculate damage percentage for this attack only
          const damagePercentage = (actualDamage / maxPossibleDamage) * 100;
          
          // Increment turn counter for RNG
          turnCounter++;
          
          const remainingTargets = target.count > 0 ? target.count : 0;
          
          battleLog.push(
            `${TROOP_STATS[unit.type].name} attacks ${TROOP_STATS[target.type].name} ` +
            `using ${isRangedAttack ? 'Ranged' : 'Melee'} attack. ` +
            `${effectiveUnitsKilled.toLocaleString()} were killed, ${remainingTargets.toLocaleString()} remaining (${damagePercentage.toFixed(2)}%)`
          );
          
          // Check if this attack used less than 20% of potential damage
          if (damagePercentage < 20) {
            potentialTargets = battleUnits.filter(t => 
              t.count > 0 && 
              t.isAttacker !== unit.isAttacker &&
              (Math.abs(unit.position - t.position) <= (unit.range || 0) || 
               Math.abs(unit.position - t.position) <= 1)
            );
            
            // Removed the 'Attacking again...' log message
          }
        }        
      }
    }
    
    // Check if battle should end - count actual remaining units on each side
    const attackerAlive = battleUnits
      .filter(u => u.isAttacker && u.count > 0)
      .reduce((sum, unit) => sum + unit.count, 0);
      
    const defenderAlive = battleUnits
      .filter(u => !u.isAttacker && u.count > 0)
      .reduce((sum, unit) => sum + unit.count, 0);
    
    if (attackerAlive === 0 || defenderAlive === 0) {
      battleLog.push("\n=== BATTLE ENDED ===");
      if (attackerAlive === 0 && defenderAlive === 0) {
        battleLog.push("The battle ended in a draw!");
      } else if (attackerAlive === 0) {
        battleLog.push("The defenders have won the battle!");
      } else {
        battleLog.push("The attackers have won the battle!");
      }
      
      // Add final unit counts
      battleLog.push("\n=== FINAL FORCES ===");
      
      // Show attackers first
      battleUnits
        .filter(u => u.isAttacker && u.count > 0)
        .sort((a, b) => TROOP_STATS[b.type].power - TROOP_STATS[a.type].power)
        .forEach(unit => {
          battleLog.push(`Attacker: ${unit.count}x ${TROOP_STATS[unit.type].name}`);
        });
      
      // Then show defenders
      battleUnits
        .filter(u => !u.isAttacker && u.count > 0)
        .sort((a, b) => TROOP_STATS[b.type].power - TROOP_STATS[a.type].power)
        .forEach(unit => {
          battleLog.push(`Defender: ${unit.count}x ${TROOP_STATS[unit.type].name}`);
        });
      
      break;
    }
    
    battleLog.push(""); // Add empty line between rounds
  }
  
  if (round >= maxRounds) {
    battleLog.push("\n=== BATTLE ENDED ===");
    battleLog.push("The battle reached the maximum number of rounds and was declared a draw!");
  }
  
  // Final forces are now displayed in the battle end condition
  
  return battleLog.join("\n");
    const unitStats = TROOP_STATS[unit.type];
    
    // Movement phase
    if (!unitStats.isRanged) {
      // Melee units move toward the enemy
      const isAttacker = unit.position < battlefieldRange / 2;
      const moveDistance = Math.min(unitStats.speed, battlefieldRange);
      
      if (isAttacker) {
        unit.position = Math.min(unit.position + moveDistance, battlefieldRange);
      } else {
        unit.position = Math.max(unit.position - moveDistance, 0);
      }
      
      battleLog.push(`${unit.count}x ${unitStats.name} move to position ${unit.position}`);
    }
    
    // Attack phase
    const potentialTargets = battleUnits.filter(target => {
      // Can't attack own side or dead units
      if ((unit.position < battlefieldRange / 2) === (target.position < battlefieldRange / 2)) {
        return false;
      }
      
      // Check if target is in range
      const distance = Math.abs(unit.position - target.position);
      return distance <= unitStats.range || distance === 0;
    });
    
    if (potentialTargets.length > 0 && unit.count > 0) {
      // For now, just attack the first available target
      const target = potentialTargets[0];
      const targetStats = TROOP_STATS[target.type];
      const isRangedAttack = unitStats.range > 0 && Math.abs(unit.position - target.position) > 0;
      const attackPower = isRangedAttack ? unitStats.rangedAttack : unitStats.attack;
      
      // Simple damage calculation (simplified)
      const damage = unit.count * attackPower * (1 - (targetStats.defense / (targetStats.defense + 100)));
      const unitsKilled = Math.min(target.count, Math.ceil(damage / targetStats.health));
      
      if (unitsKilled > 0) {
        target.count -= unitsKilled;
        battleLog.push(
          `${unit.count}x ${unitStats.name} ${isRangedAttack ? 'shoot' : 'attack'} ` +
          `${target.count + unitsKilled}x ${targetStats.name}, killing ${unitsKilled} ` +
          `${unitsKilled === 1 ? 'unit' : 'units'} (${Math.round(damage)} damage)`
        );
      }
    }

  
  // Check battle results
  const attackerUnitsRemaining = battleUnits
    .filter(u => u.position < battlefieldRange / 2 && u.count > 0).length;
  const defenderUnitsRemaining = battleUnits
    .filter(u => u.position >= battlefieldRange / 2 && u.count > 0).length;
  
  if (attackerUnitsRemaining === 0 && defenderUnitsRemaining === 0) {
    battleLog.push("\nBattle ended in a draw!");
  } else if (attackerUnitsRemaining === 0) {
    battleLog.push("\nDefenders win the battle!");
  } else if (defenderUnitsRemaining === 0) {
    battleLog.push("\nAttackers win the battle!");
  } else {
    battleLog.push("\nBattle continues...");
  }
  
  // Add initial battle setup to the log
  battleLog.unshift(
    "Battle Setup:",
    `- Battlefield length: ${battlefieldRange}`,
    "- Units in battle:" + battleUnits
      .filter(u => u.count > 0)
      .map(u => `\n  - ${u.count}x ${TROOP_STATS[u.type].name} (${u.position < battlefieldRange / 2 ? 'Attacker' : 'Defender'})`)
      .join('')
  );
  
  return battleLog.join("\n");
  };

  const calculate = () => {
    // Generate a new random seed if advanced options are hidden
    if (!showAdvanced) {
      setSeed(Math.floor(Math.random() * 1000000));
    }
    
    // Get the defender troops based on selected terrain and level
    let defenderTroops: EnemyTroops | null = null;
    if (defender.terrain === 'enemy') {
      // Handle player vs player combat
      defenderTroops = {
        porter: 0, conscript: 0, spy: 0, halberdier: 0, minotaur: 0,
        longbowMan: 0, swiftStrikeDragon: 0, armoredTransport: 0,
        giant: 0, fireMirror: 0, battleDragon: 0
      };
    } else {
      // Get troops for the selected terrain and level
      const terrainTroops = ENEMY_COMPOSITIONS[defender.terrain];
      if (terrainTroops) {
        defenderTroops = terrainTroops[defender.level.toString()];
      }
    }

    if (!defenderTroops) {
      setResult('Error: Could not determine defender troops');
      return;
    }

    // Get the current research state from formData
    const currentResearch = {
      metalurgy: formData.metalurgy,
      rapidDeployment: formData.rapidDeployment,
      dragonry: formData.dragonry,
      medicine: formData.medicine,
      weaponsCalibration: formData.weaponsCalibration
    };
    
    // Also update the special items to match the component's state
    const currentSpecialItems = {
      crimsonBull: specialItems.crimsonBull,
      glowingShields: specialItems.glowingShields,
      purpleBones: specialItems.purpleBones,
      dragonHeart: specialItems.dragonHeart
    };

    // Call the battle simulation with the current research state
    const battleResult = simulateBattle(attackers, defenderTroops, currentResearch);
    setResult(battleResult);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-4 py-12">
      <Head>
        <title>ROASim - Research Calculator</title>
        <meta name="description" content="Research Calculator for ROA Sim" />
      </Head>
        <div className="h-8" />
      <main className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">ROASim</h1>
        <div className="h-10" />
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-center">Special Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { id: 'crimsonBull', label: 'Crimson Bull' },
                { id: 'glowingShields', label: 'Glowing Shields' },
                { id: 'purpleBones', label: 'Purple Bones' },
                { id: 'dragonHeart', label: 'Dragon Heart' },
              ].map(({ id, label }) => (
                <label key={id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id={id}
                    name={id}
                    checked={specialItems[id as keyof typeof specialItems]}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="h-10" />
            <h2 className="text-2xl font-semibold text-center">Research Levels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'weaponsCalibration', label: 'Weapons Calibration' },
                { id: 'metalurgy', label: 'Metalurgy' },
                { id: 'medicine', label: 'Medicine' },
                { id: 'rapidDeployment', label: 'Rapid Deployment' },
                { id: 'dragonry', label: 'Dragonry' },
              ].map(({ id, label }) => (
                <div key={id} className="space-y-2">
                  <label htmlFor={id} className="block text-sm font-medium">
                    {label}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      id={id}
                      name={id}
                      min="1"
                      max="10"
                      value={formData[id as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-mono w-8 text-center">
                      {formData[id as keyof typeof formData]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-10" />
            <h2 className="text-2xl font-semibold text-center mt-8">Defenders</h2>
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-center mb-6">Target</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'camp', label: 'Camp' },
                  { id: 'forest', label: 'Forest' },
                  { id: 'savanna', label: 'Savanna' },
                  { id: 'lake', label: 'Lake' },
                  { id: 'mountain', label: 'Mountain' },
                  { id: 'hills', label: 'Hills' },
                  { id: 'plains', label: 'Plains' },
                  { id: 'enemy', label: 'Enemy' },
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`terrain-${id}`}
                      name="terrain"
                      value={id}
                      checked={defender.terrain === id}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`terrain-${id}`} className="block text-sm font-medium">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
                <div className="h-6" />
              {defender.terrain !== 'enemy' && (
                <div className="mt-8">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold">
                      {defender.terrain.charAt(0).toUpperCase() + defender.terrain.slice(1)} Level
                    </h3>
                  </div>
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDefender(prev => ({ ...prev, level }))}
                        className={`py-2 px-1 rounded-md text-sm font-medium transition-colors ${
                          defender.level === level 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-10" />
            <h2 className="text-2xl font-semibold text-center">Attackers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { id: 'porter', label: 'Porter' },
                { id: 'conscript', label: 'Conscript' },
                { id: 'spy', label: 'Spy' },
                { id: 'halberdier', label: 'Halberdier' },
                { id: 'minotaur', label: 'Minotaur' },
                { id: 'longbowMan', label: 'Longbow Man' },
                { id: 'swiftStrikeDragon', label: 'Swift Strike Dragon' },
                { id: 'armoredTransport', label: 'Armored Transport' },
                { id: 'giant', label: 'Giant' },
                { id: 'fireMirror', label: 'Fire Mirror' },
                { id: 'battleDragon', label: 'Battle Dragon' },
              ].map(({ id, label }) => (
                <div key={id} className="space-y-1">
                  <label htmlFor={id} className="block text-sm font-medium">
                    {label}
                  </label>
                  <input
                    type="number"
                    id={id}
                    name={id}
                    data-section="attackers"
                    value={attackers[id as keyof Attackers]}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              ))}
            </div>
            <div className="h-10" />
            {/* Advanced Options */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showAdvanced"
                  checked={showAdvanced}
                  onChange={() => setShowAdvanced(!showAdvanced)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="showAdvanced" className="ml-2 text-sm font-medium cursor-pointer">
                  Show Advanced Options
                </label>
              </div>
              
              {showAdvanced && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label htmlFor="seed" className="block text-sm font-medium mb-1">
                      Seed:
                    </label>
                    <input
                      type="number"
                      id="seed"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded bg-gray-600 border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      min="0"
                      placeholder="Random seed for battle RNG"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="h-10" />
            <div className="pt-6">
              <button
                onClick={calculate}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-lg transition-colors"
              >
                Calculate
              </button>
            </div>
            <div className="h-6" />
            {/* Fixed height container to prevent layout shift */}
            <div className="mt-6 min-h-[200px]">
              {result && (
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Results:</h3>
                  <div className="font-mono bg-gray-800 p-3 rounded whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Troop Stats Data
interface TroopStats {
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

const TROOP_STATS: Record<string, Troostats> = {
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
  // Add more troops as needed
};

// Enemy Troop Compositions
interface EnemyTroops {
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

interface EnemyComposition {
  [level: string]: EnemyTroops;
}

const CAMP_TROOPS: EnemyComposition = {
  '1': { porter: 1500, conscript: 500,},
  '2': { porter: 3000, conscript: 1500, spy: 500, halberdier: 1000 },
  '3': { porter: 6000, conscript: 2000, spy: 1000, halberdier: 2000, minotaur: 1000 },
  '4': { porter: 15000, conscript: 5000, spy: 2000, halberdier: 4000, minotaur: 2000, longbowMan: 1500 },
  '5': { porter: 300000, conscript: 10000, spy: 5000, halberdier: 10000, minotaur: 4000, longbowMan: 3000, swiftStrikeDragon: 2000 },
  '6': { porter: 45000, conscript: 15000, spy: 10000, halberdier: 20000, minotaur: 15000, longbowMan: 1000, swiftStrikeDragon: 4000 },
  '7': { porter: 90000, conscript: 30000, spy: 15000, halberdier: 30000, minotaur: 20000, longbowMan: 15000, swiftStrikeDragon: 8000, armoredTransport: 2000 },
  '8': { porter: 180000, conscript: 60000, spy: 30000, halberdier: 60000, minotaur: 30000, longbowMan: 30000, swiftStrikeDragon: 20000, armoredTransport: 4000 },
  '9': { porter: 350000, conscript: 120000, spy: 60000, halberdier: 120000, minotaur: 60000, longbowMan: 45000, swiftStrikeDragon: 40000, armoredTransport: 8000, giant: 5000 },
  '10': { porter: 750000, conscript: 250000, spy: 120000, halberdier: 250000, minotaur: 120000, longbowMan: 90000, swiftStrikeDragon: 60000, armoredTransport: 16000, giant: 10000, fireMirror: 10000, battleDragon: 10000 }
};

const WILDS_TROOPS: EnemyComposition = {
  '1': { porter: 5000, conscript: 2500, spy: 1000, halberdier: 500, minotaur: 250, longbowMan: 100, swiftStrikeDragon: 50, armoredTransport: 25, giant: 12, fireMirror: 5, battleDragon: 2 },
  '2': { porter: 10000, conscript: 5000, spy: 2000, halberdier: 1000, minotaur: 500, longbowMan: 200, swiftStrikeDragon: 100, armoredTransport: 50, giant: 25, fireMirror: 10, battleDragon: 5 },
  '3': { porter: 20000, conscript: 10000, spy: 4000, halberdier: 2000, minotaur: 1000, longbowMan: 400, swiftStrikeDragon: 200, armoredTransport: 100, giant: 50, fireMirror: 20, battleDragon: 10 },
  '4': { porter: 40000, conscript: 20000, spy: 8000, halberdier: 4000, minotaur: 2000, longbowMan: 800, swiftStrikeDragon: 400, armoredTransport: 200, giant: 100, fireMirror: 40, battleDragon: 20 },
  '5': { porter: 80000, conscript: 40000, spy: 16000, halberdier: 8000, minotaur: 4000, longbowMan: 1600, swiftStrikeDragon: 800, armoredTransport: 400, giant: 200, fireMirror: 80, battleDragon: 40 },
  '6': { porter: 120000, conscript: 60000, spy: 24000, halberdier: 12000, minotaur: 6000, longbowMan: 2400, swiftStrikeDragon: 1200, armoredTransport: 600, giant: 300, fireMirror: 120, battleDragon: 60 },
  '7': { porter: 180000, conscript: 90000, spy: 36000, halberdier: 18000, minotaur: 9000, longbowMan: 3600, swiftStrikeDragon: 1800, armoredTransport: 900, giant: 450, fireMirror: 180, battleDragon: 90 },
  '8': { porter: 270000, conscript: 135000, spy: 54000, halberdier: 27000, minotaur: 13500, longbowMan: 5400, swiftStrikeDragon: 2700, armoredTransport: 1350, giant: 675, fireMirror: 270, battleDragon: 135 },
  '9': { porter: 400000, conscript: 200000, spy: 80000, halberdier: 40000, minotaur: 20000, longbowMan: 8000, swiftStrikeDragon: 4000, armoredTransport: 2000, giant: 1000, fireMirror: 400, battleDragon: 200 },
  '10': { porter: 600000, conscript: 300000, spy: 120000, halberdier: 60000, minotaur: 30000, longbowMan: 12000, swiftStrikeDragon: 6000, armoredTransport: 3000, giant: 1500, fireMirror: 600, battleDragon: 300 }
};

const ENEMY_COMPOSITIONS = {
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
};

// Helper function to get composition as formatted string
const getCompositionString = (troops: EnemyTroops): string => {
  return Object.entries(troops)
    .map(([unit, count]) => `${count.toLocaleString()} ${unit}`)
    .join(', ');
};

// Calculate modified stats for attacking units based on research and special items
const calculateAttackerStats = (unitType: keyof typeof TROOP_STATS, research: typeof formData, specialItems: typeof specialItems) => {
  const unit = TROOP_STATS[unitType];
  if (!unit) return { attack: 0, defense: 0, health: 0 };

  // Base values
  let attack = unit.attack;
  let defense = unit.defense;
  let health = unit.health;

  // Calculate research bonuses
  const metalurgyBonus = research.metalurgy * 0.05;
  const medicineBonus = research.medicine * 0.05;
  const rapidDeploymentBonus = research.rapidDeployment * 0.05;
  const weaponsCalibrationBonus = research.weaponsCalibration * 0.05;
  
  // Dragon-specific bonuses
  const isDragon = unit.type === 'dragon';
  const dragonryBonus = isDragon ? research.dragonry * 0.10 : 0;
  
  // Ranged unit bonuses
  const isRanged = unit.type === 'ranged';
  const rangeBonus = isRanged ? weaponsCalibrationBonus : 0;

  // Calculate attack with all bonuses
  let attackBonus = metalurgyBonus + rapidDeploymentBonus + dragonryBonus;
  
  // Apply special items
  if (specialItems.crimsonBull) attackBonus += 0.10; // +10% attack
  if (specialItems.glowingShields) attackBonus += 0.05; // +5% attack (from glowing shields)
  
  // Apply attack bonuses
  attack = Math.round(attack * (1 + attackBonus));
  
  // Calculate defense with all bonuses
  let defenseBonus = metalurgyBonus;
  if (specialItems.glowingShields) defenseBonus += 0.10; // +10% defense
  
  defense = Math.round(defense * (1 + defenseBonus));
  
  // Calculate health with all bonuses
  let healthBonus = medicineBonus;
  if (specialItems.purpleBones) healthBonus += 0.10; // +10% health
  
  health = Math.round(health * (1 + healthBonus));
  
  // Calculate range bonus for ranged units
  const range = isRanged ? Math.round(unit.range * (1 + rangeBonus)) : 0;
  
  // Calculate ranged attack for ranged units
  let rangedAttack = 0;
  if (isRanged) {
    rangedAttack = Math.round(unit.rangedAttack * (1 + attackBonus));
  }

  return {
    attack,
    defense,
    health,
    range: isRanged ? range : undefined,
    rangedAttack: isRanged ? rangedAttack : undefined,
    speed: unit.speed, // Speed is not modified by research/items in current spec
    load: unit.load    // Load capacity is not modified by research/items in current spec
  };
};

export default ROASim;
