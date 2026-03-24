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

// Hybrid troop melee priority logic
export const checkHybridMeleePriority = (
  unit: BattleUnit,
  battleUnits: BattleUnit[],
  battlefieldRange: number
): { shouldMoveToMelee: boolean; movementResult?: MovementResult } => {
  const isHybrid = unit.range > 0 && unit.rangedAttack > 0 && unit.attack > 0;
  
  if (!isHybrid) {
    return { shouldMoveToMelee: false };
  }

  // Check for enemies in melee range
  const { meleeTargets } = getPotentialTargets(unit, battleUnits, true);
  
  if (meleeTargets.length > 0) {
    return { shouldMoveToMelee: false }; // Already in melee range
  }

  // Check if we could reach melee with movement
  const potentialMeleeTargets = battleUnits.filter(target => {
    if (target.count <= 0) return false;
    if (unit.isAttacker === target.isAttacker) return false;
    const distance = Math.abs(unit.position - target.position);
    return distance <= (unit.speed + 1); // Can reach with movement + melee range
  });

  if (potentialMeleeTargets.length > 0 && unit.speed > 0) {
    const movementResult = calculateMovementTowardsEnemy(unit, battleUnits, battlefieldRange, 1);
    return { shouldMoveToMelee: true, movementResult };
  }

  return { shouldMoveToMelee: false };
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
