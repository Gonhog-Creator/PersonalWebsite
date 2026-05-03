import { BattleUnit } from './types';

export interface MovementResult {
  newPosition: number;
  moved: boolean;
  reason: string;
}

export interface TargetingResult {
  targets: BattleUnit[];
  meleeTargets: BattleUnit[];
  rangedTargets: BattleUnit[];
}

// Get potential targets for a unit
export const getPotentialTargets = (
  unit: BattleUnit,
  battleUnits: BattleUnit[],
  prioritizeMelee: boolean = false
): TargetingResult => {
  const allTargets = battleUnits.filter(target => {
    if (target.count <= 0) return false;
    if (unit.isAttacker === target.isAttacker) return false;
    
    const distance = Math.abs(unit.position - target.position);
    
    // For hybrid troops prioritizing melee, only check melee range
    if (prioritizeMelee) {
      return distance <= 1;
    }
    
    // Check melee range (1) for all units
    if (distance <= 1) return true;
    
    // Check ranged attack range
    const attackRange = unit.range || 0;
    return distance <= attackRange;
  });

  const meleeTargets = battleUnits.filter(target => {
    if (target.count <= 0) return false;
    if (unit.isAttacker === target.isAttacker) return false;
    const distance = Math.abs(unit.position - target.position);
    return distance <= 1;
  });

  const rangedTargets = battleUnits.filter(target => {
    if (target.count <= 0) return false;
    if (unit.isAttacker === target.isAttacker) return false;
    const distance = Math.abs(unit.position - target.position);
    const attackRange = unit.range || 0;
    return distance <= attackRange && distance > 1;
  });

  return {
    targets: allTargets,
    meleeTargets,
    rangedTargets
  };
};

// Calculate movement towards closest enemy
export const calculateMovementTowardsEnemy = (
  unit: BattleUnit,
  battleUnits: BattleUnit[],
  battlefieldRange: number,
  targetDistance: number = 1
): MovementResult => {
  const currentPos = Number.isFinite(unit.position) ? unit.position : 0;
  
  // Find closest enemy
  const closestEnemy = battleUnits
    .filter(target => target.count > 0 && target.isAttacker !== unit.isAttacker)
    .sort((a, b) => {
      const posA = Number.isFinite(a.position) ? a.position : 0;
      const posB = Number.isFinite(b.position) ? b.position : 0;
      const distA = Math.abs(currentPos - posA);
      const distB = Math.abs(currentPos - posB);
      return distA - distB;
    })[0];

  if (!closestEnemy) {
    return { newPosition: currentPos, moved: false, reason: 'No enemies found' };
  }

  const enemyPos = Number.isFinite(closestEnemy.position) ? closestEnemy.position : 0;
  
  // Determine movement direction
  let moveDirection = unit.isAttacker ? -1 : 1;
  if ((unit.isAttacker && currentPos < enemyPos) || (!unit.isAttacker && currentPos > enemyPos)) {
    moveDirection *= -1;
  }

  // Calculate new position
  let newPosition = currentPos + (unit.speed * moveDirection);

  // For specific target distance (like melee range)
  if (targetDistance > 0) {
    if (unit.isAttacker) {
      newPosition = Math.max(enemyPos - targetDistance, Math.min(newPosition, enemyPos + targetDistance));
    } else {
      newPosition = Math.min(enemyPos + targetDistance, Math.max(newPosition, enemyPos - targetDistance));
    }
  }

  // Clamp to battlefield bounds
  newPosition = Math.max(0, Math.min(newPosition, battlefieldRange));

  // Check for friendly unit blocking
  const friendlyUnits = battleUnits.filter(u => 
    u.count > 0 && 
    u.isAttacker === unit.isAttacker && 
    u.id !== unit.id
  );

  const blockingUnit = unit.isAttacker
    ? friendlyUnits.filter(u => u.position < currentPos && u.position >= newPosition)
                      .sort((a, b) => b.position - a.position)[0]
    : friendlyUnits.filter(u => u.position > currentPos && u.position <= newPosition)
                      .sort((a, b) => a.position - b.position)[0];

  if (blockingUnit) {
    newPosition = unit.isAttacker ? blockingUnit.position + 1 : blockingUnit.position - 1;
  }

  const moved = newPosition !== currentPos && unit.speed > 0;
  const reason = moved ? `Moved towards enemy at position ${enemyPos}` : 'No movement possible';

  return { newPosition, moved, reason };
};

// Calculate damage potential for different attack approaches
export const calculateDamagePotential = (
  unit: BattleUnit,
  target: BattleUnit,
  approach: 'melee' | 'ranged'
): { potentialDamage: number; attackPower: number; distance: number } => {
  const attackPower = approach === 'melee' ? unit.attack : unit.rangedAttack;
  const distance = Math.abs(unit.position - target.position);
  
  // Calculate attack/defense ratio (clamped between 0.3 and 2.1)
  const attackDefenseRatio = Math.min(2.1, Math.max(0.3, attackPower / target.defense));
  
  // Calculate potential damage using average RNG (1.0)
  const baseDamage = attackPower * unit.count;
  const potentialDamage = Math.round(baseDamage * attackDefenseRatio * 1.0);
  
  return { potentialDamage, attackPower, distance };
};

// Compare melee vs ranged damage potential for hybrid troops
export const compareAttackApproaches = (
  unit: BattleUnit,
  battleUnits: BattleUnit[],
  battlefieldRange: number
): { bestApproach: 'melee' | 'ranged' | 'stay'; movementResult?: MovementResult; reason: string } => {
  const isHybrid = unit.range > 0 && unit.rangedAttack > 0 && unit.attack > 0;
  
  if (!isHybrid) {
    return { bestApproach: 'stay', reason: 'Not a hybrid unit' };
  }

  // Get all potential targets
  const { targets, meleeTargets, rangedTargets } = getPotentialTargets(unit, battleUnits);
  
  if (targets.length === 0) {
    return { bestApproach: 'stay', reason: 'No targets available' };
  }

  let bestMeleeDamage = 0;
  let bestRangedDamage = 0;
  let bestMeleeTarget: BattleUnit | null = null;
  let bestRangedTarget: BattleUnit | null = null;

  // Calculate current ranged damage potential
  rangedTargets.forEach(target => {
    const { potentialDamage } = calculateDamagePotential(unit, target, 'ranged');
    if (potentialDamage > bestRangedDamage) {
      bestRangedDamage = potentialDamage;
      bestRangedTarget = target;
    }
  });

  // Calculate potential melee damage (if we can reach melee)
  if (unit.speed > 0) {
    const potentialMeleeTargets = battleUnits.filter(target => {
      if (target.count <= 0) return false;
      if (unit.isAttacker === target.isAttacker) return false;
      const distance = Math.abs(unit.position - target.position);
      return distance <= (unit.speed + 1); // Can reach with movement + melee range
    });

    potentialMeleeTargets.forEach(target => {
      const { potentialDamage } = calculateDamagePotential(unit, target, 'melee');
      if (potentialDamage > bestMeleeDamage) {
        bestMeleeDamage = potentialDamage;
        bestMeleeTarget = target;
      }
    });
  }

  // Compare approaches - prefer melee when significantly better (matching in-game behavior)
  if (bestMeleeDamage > bestRangedDamage * 1.05) { // 5% threshold to prefer melee
    const movementResult = calculateMovementTowardsEnemy(unit, battleUnits, battlefieldRange, 1);
    return { 
      bestApproach: 'melee', 
      movementResult, 
      reason: `Melee damage (${bestMeleeDamage.toLocaleString()}) > Ranged damage (${bestRangedDamage.toLocaleString()})` 
    };
  } else if (bestRangedDamage > 0) {
    return { 
      bestApproach: 'ranged', 
      reason: `Ranged damage (${bestRangedDamage.toLocaleString()}) >= Melee damage (${bestMeleeDamage.toLocaleString()})` 
    };
  }

  return { bestApproach: 'stay', reason: 'No significant damage advantage' };
};

// Standard movement logic for when no targets are in range
export const standardMovement = (
  unit: BattleUnit,
  battleUnits: BattleUnit[],
  battlefieldRange: number
): MovementResult => {
  return calculateMovementTowardsEnemy(unit, battleUnits, battlefieldRange, 0);
};

// Multi-attack movement logic (for hybrid units after inefficient attacks)
export const multiAttackMovement = (
  unit: BattleUnit,
  battleUnits: BattleUnit[],
  battlefieldRange: number
): MovementResult => {
  // Check if there are any targets in range
  const { targets } = getPotentialTargets(unit, battleUnits);
  
  if (targets.length === 0 && unit.speed > 0) {
    return calculateMovementTowardsEnemy(unit, battleUnits, battlefieldRange, 0);
  }
  
  return { 
    newPosition: unit.position, 
    moved: false, 
    reason: targets.length > 0 ? 'Targets already in range' : 'No movement speed' 
  };
};
