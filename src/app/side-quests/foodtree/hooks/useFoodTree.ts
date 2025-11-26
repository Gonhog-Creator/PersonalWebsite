'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export type NodeType = 'ingredient' | 'dish' | 'root' | 'plant' | 'animal' | 'other';

export interface FoodNode {
  id: string;
  name: string;
  type: NodeType;
  children: string[];
  parentIngredients?: string[];
  position: [number, number, number];
  color: string;
  size: number;
  depth: number; // Degree of separation from the root
}

interface Edge {
  sourceId: string;
  targetId: string;
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
  color: string;
}

export interface Ingredient {
  id: string;
  name: string;
  foodType: string;
  parentIngredients?: string[];
  [key: string]: unknown; // Changed from any to unknown for better type safety
}

// Simple deterministic hash function
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate positions in a circle around the category node
const generatePositions = (
  count: number, 
  offsetX: number = 0, 
  y: number = 0, 
  baseRadius: number = 4,
  seed: string = ''
): [number, number, number][] => {
  if (count === 0) return [];
  
  // Calculate radius based on number of items
  const radius = baseRadius * (1 + Math.log1p(count) * 0.3);
  
  // Calculate angle step between items (in radians)
  const angleStep = (Math.PI * 2) / Math.max(1, count);
  
  // Use the seed to generate a consistent starting angle
  const seedHash = seed ? simpleHash(seed) : 0;
  const baseAngle = (seedHash % 360) * (Math.PI / 180); // Convert to radians
  
  return Array.from({ length: count }, (_, i) => {
    // Calculate angle for this item with consistent offset
    const angle = baseAngle + angleStep * i - (count > 1 ? Math.PI/2 : 0);
    
    // Calculate positions in a circle
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    // Add slight vertical offset based on position for better visibility
    const yOffset = Math.sin(angle * 1.5) * 0.5;
    
    return [
      offsetX + x,  // X position
      y + yOffset,  // Y position (slight vertical offset)
      z             // Z position
    ] as [number, number, number];
  });
};

// Force simulation parameters
const FORCE_STRENGTH = 0.8; // Overall force strength
const REPULSION_STRENGTH = 0.8; // Base repulsion strength between nodes
const MAIN_NODE_REPULSION_MULTIPLIER = 1.8; // Reduced extra repulsion for main nodes
const SPRING_STRENGTH = 0.08; // Spring strength for connections
const SPRING_LENGTH = 3; // Optimal distance between connected nodes
const VELOCITY_DECAY = 0.7; // How quickly nodes slow down
const MAX_VELOCITY = 10; // Maximum velocity a node can have
const ITERATIONS = 150; // Increased iterations for better convergence with depth-based positioning

export const useFoodTree = () => {
  const [nodes, setNodes] = useState<FoodNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const simulationRef = useRef<number>();
  
  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Helper function to categorize ingredients
  const getIngredientCategory = (ingredient: { foodType?: string }): 'plant' | 'animal' | 'other' => {
    const type = ingredient.foodType || 'plant'; // Default to 'plant' if not specified
    return type === 'animal' ? 'animal' : type === 'other' ? 'other' : 'plant';
  };

  // Fetch and process ingredients
  const fetchIngredients = useCallback(async () => {
    if (!isMounted.current) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch ingredients from API
      const response = await fetch('/api/foodtree/ingredients');
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      
      const apiIngredients = await response.json();
      if (!Array.isArray(apiIngredients)) {
        console.error('Expected array of ingredients, got:', apiIngredients);
        return [];
      }
      
      console.log('Raw API response:', apiIngredients);
      
      // Process each ingredient
      return apiIngredients.map(item => {
        // The API now returns properly formatted ingredient objects
        const name = item.name || '';
        const foodType = item.foodType || 'grown';
        const parentIngredients = Array.isArray(item.parentIngredients) 
          ? item.parentIngredients 
          : [];
        
        if (!name) {
          console.warn('Ingredient has no name:', item);
        }
        
        const category = getIngredientCategory({ foodType });
        const node: FoodNode = {
          id: item.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
          name: name.trim(),
          type: item.type === 'dish' ? 'dish' : 'ingredient',
          foodType,
          parentIngredients,
          category
        };
        
        return node;
      });

      return processedIngredients;
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError('Failed to load ingredients. Please try again later.');
      return [];
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Define the ingredient type for categorization
  interface CategorizableIngredient {
    foodType?: string;
    [key: string]: unknown;
  }

  // Categorize ingredients based on their foodType
  const categorizeIngredient = (ingredient: CategorizableIngredient): 'plant' | 'animal' | 'other' => {
    const type = ingredient.foodType || 'plant'; // Default to 'plant' if not specified
    return type === 'animal' ? 'animal' : type === 'other' ? 'other' : 'plant';
  };

  // Fetch and transform data into nodes and edges
  useEffect(() => {
    const controller = new AbortController();
    let isSubscribed = true;
    
    const loadData = async () => {
      try {
        const ingredients = await fetchIngredients();
        if (!isSubscribed || !isMounted.current) return;

        // Create root node
        const rootNode: FoodNode = {
          id: 'root',
          name: 'Food Tree',
          type: 'root',
          children: [],
          position: [0, 0, 0],  // Root at the center
          color: '#9ca3af',
          size: 1.2,
          depth: 0  // Root has depth 0
        };

        // Create category nodes in a triangle formation around the root
        const plantNode: FoodNode = {
          id: 'plant',
          name: '🌱 Plant',
          type: 'plant',
          children: [],
          position: [0, 8, -5],
          color: '#86efac',
          size: 1.0,
          depth: 1  // One step from root
        };

        const animalNode: FoodNode = {
          id: 'animal',
          name: '🐄 Animal',
          type: 'animal',
          children: [],
          position: [-6, 8, 5],
          color: '#fca5a5',
          size: 1.0,
          depth: 1  // One step from root
        };

        const otherNode: FoodNode = {
          id: 'other',
          name: '🧂 Other',
          type: 'other',
          children: [],
          position: [6, 8, 5],
          color: '#93c5fd',
          size: 1.0,
          depth: 1  // One step from root
        };

        // Connect root to category nodes
        rootNode.children = ['plant', 'animal', 'other'];

        // Create ingredient nodes
        const ingredientNodes: FoodNode[] = [];
        const nodeMap = new Map<string, FoodNode>();
        
        // Separate ingredients into categories
        const plantIngredients = ingredients.filter(ing => 
          categorizeIngredient(ing) === 'plant');
        const animalIngredients = ingredients.filter(ing => 
          categorizeIngredient(ing) === 'animal');
        const otherIngredients = ingredients.filter(ing => 
          categorizeIngredient(ing) === 'other');
          
        console.log('Plant ingredients:', plantIngredients);
        console.log('Animal ingredients:', animalIngredients);
        console.log('Other ingredients:', otherIngredients);
        
        // Generate positions for each category in a circle
        // Positioned around their respective category nodes
        const plantBaseRadius = 3 + Math.min(plantIngredients.length * 0.15, 3);
        const animalBaseRadius = 3 + Math.min(animalIngredients.length * 0.15, 3);
        const otherBaseRadius = 3 + Math.min(otherIngredients.length * 0.15, 3);
        
        // Generate positions around each category node
        const plantPositions = generatePositions(plantIngredients.length, 0, 8, plantBaseRadius, 'plant');
        const animalPositions = generatePositions(animalIngredients.length, -6, 8, animalBaseRadius, 'animal');
        const otherPositions = generatePositions(otherIngredients.length, 6, 8, otherBaseRadius, 'other');
        
        // Track node positions to prevent overlap
        const positionMap = new Map<string, [number, number, number]>();
        
        // Process all ingredients with their categories
        const processIngredients = (ingredients: Ingredient[], positions: [number, number, number][], category: 'plant' | 'animal' | 'other') => {
    console.log(`Processing ${category} ingredients:`, ingredients);
    
    return ingredients.map((ingredient, index) => {
      // Skip if no ID or if name is empty or whitespace only
      if (!ingredient.id || !ingredient.name?.trim()) {
        console.warn(`Skipping invalid ingredient (missing ID or name): ${JSON.stringify(ingredient)}`);
        return null;
      }
      
      // Clean up the name
      const cleanName = ingredient.name.trim();
      
      if (!cleanName) {
        console.warn(`Skipping ingredient with empty name: ${JSON.stringify(ingredient)}`);
        return null;
      }
            
            const isDish = ingredient.type === 'dish';
            // Use the pre-calculated position from the radial distribution
            const [posX, posY, posZ] = positions[index];
            // Use const since these values are never reassigned
            const baseX = posX;
            const baseY = 6 + posY; // Add vertical offset from the center
            // baseZ is not used, so we can remove it or keep it if needed for future use
            const baseZ = posZ; // Use Z for slight depth variation
            
            const basePosition: [number, number, number] = [
              baseX,
              baseY,
              positions[index][2]
            ];
            
            // Determine color based on category and type
            let color = '#93c5fd'; // Default blue
            if (category === 'plant') {
              color = isDish ? '#86efac' : '#4ade80'; // Light green for plant dishes, green for ingredients
            } else if (category === 'animal') {
              color = isDish ? '#fca5a5' : '#f87171'; // Light red for animal dishes, red for ingredients
            } else {
              color = isDish ? '#93c5fd' : '#60a5fa'; // Light blue for other dishes, blue for ingredients
            }
            
            // Calculate depth based on parent nodes
            let nodeDepth = 2; // Default to 2 (root -> category -> this node)
            
            if (ingredient.parentIngredients?.length) {
              // If we have parent ingredients, find the minimum depth among them and add 1
              const parentDepths = ingredient.parentIngredients
                .map(parentId => {
                  const parent = nodeMap.get(parentId);
                  return parent ? (parent.depth ?? 2) : 2; // Default to 2 if parent not found
                });
              
              if (parentDepths.length > 0) {
                nodeDepth = Math.min(...parentDepths) + 1;
              }
            }
            
            const node: FoodNode = {
              id: ingredient.id,
              name: ingredient.name,
              type: (ingredient.type || 'ingredient') as NodeType,
              children: [],
              parentIngredients: ingredient.parentIngredients || [],
              position: [...basePosition],
              color,
              size: isDish ? 0.6 : 0.5,
              depth: nodeDepth
            };
            
            console.log(`Created ${category} node:`, node);
            
            positionMap.set(ingredient.id, [...node.position]);
            nodeMap.set(ingredient.id, node);
            return node;
          }).filter(Boolean) as FoodNode[];
        };
        
        // Process all ingredients
        const allIngredientNodes = [
          ...processIngredients(plantIngredients, plantPositions, 'plant'),
          ...processIngredients(animalIngredients, animalPositions, 'animal'),
          ...processIngredients(otherIngredients, otherPositions, 'other')
        ].filter(Boolean) as FoodNode[];
        
        console.log('All ingredient nodes:', allIngredientNodes);
        
        ingredientNodes.push(...allIngredientNodes);
        console.log('Ingredient nodes after push:', ingredientNodes);

        // Create edges
        const edges: Edge[] = [
          // Connect root to category nodes with colored edges
          {
            sourceId: 'root',
            targetId: 'plant',
            sourcePosition: rootNode.position,
            targetPosition: plantNode.position,
            color: '#86efac' // Light green
          },
          {
            sourceId: 'root',
            targetId: 'animal',
            sourcePosition: rootNode.position,
            targetPosition: animalNode.position,
            color: '#fca5a5' // Light red
          },
          {
            sourceId: 'root',
            targetId: 'other',
            sourcePosition: rootNode.position,
            targetPosition: otherNode.position,
            color: '#93c5fd' // Light blue
          }
        ];
        
        // First pass: Connect all ingredients to their categories based on their type
        ingredientNodes.forEach(node => {
          const ingredient = ingredients.find(i => i.id === node.id);
          if (!ingredient) return;
          
          // Determine the category based on the ingredient's foodType
          const foodType = ingredient.foodType || 'plant';
          
          // Only connect to category nodes if this is a root ingredient (no parent ingredients)
          // or if it's a base ingredient that should be connected to a category
          const shouldConnectToCategory = !ingredient.parentIngredients?.length || 
                                       (ingredient.parentIngredients?.length === 0);
          
          if (shouldConnectToCategory && (foodType === 'plant' || foodType === 'animal' || foodType === 'other')) {
            const isPlant = foodType === 'plant';
            const isAnimal = foodType === 'animal';
            const isOther = foodType === 'other';
            const categoryId = isPlant ? 'plant' : isAnimal ? 'animal' : 'other';
            const categoryNode = isPlant ? plantNode : isAnimal ? animalNode : otherNode;
            
            // Only add the edge if the node is actually positioned
            if (node.position && node.position.every(coord => coord !== undefined)) {
              edges.push({
                sourceId: categoryId,
                targetId: node.id,
                sourcePosition: categoryNode.position,
                targetPosition: node.position,
                color: isPlant ? '#86efac' : isAnimal ? '#fca5a5' : '#93c5fd' // Lighter green/blue for edges
              });
              
              // Add to the category's children if not already there
              if (isPlant && !plantNode.children.includes(node.id)) {
                plantNode.children.push(node.id);
              } else if (isAnimal && !animalNode.children.includes(node.id)) {
                animalNode.children.push(node.id);
              } else if (isOther && !otherNode.children.includes(node.id)) {
                otherNode.children.push(node.id);
              }
            }
          }
        });

        // Track node depths for hierarchical positioning
        const nodeDepths = new Map<string, number>(
          [...nodeMap.values()]
            .filter(node => !node.parentIngredients?.length)
            .map(node => [node.id, 0])
        );

        // Connect parent-child relationships with improved hierarchical spacing
        const processNode = (ingredient: Ingredient) => {
          const node = nodeMap.get(ingredient.id);
          if (!node || !ingredient.parentIngredients?.length) return;

          // Helper function to find a node by ID or name
          const findNode = (idOrName: string): FoodNode | undefined => {
            // First try exact match by ID
            let node = nodeMap.get(idOrName);
            
            // If not found by ID, try by name (case-insensitive and trimmed)
            if (!node) {
              const searchName = idOrName.trim().toLowerCase();
              node = Array.from(nodeMap.values()).find(
                n => n.name.trim().toLowerCase() === searchName
              );
            }
            
            return node;
          };
          
          // Find all parent nodes
          const parentNodes = ingredient.parentIngredients
            .map(findNode)
            .filter((parent): parent is FoodNode => {
              if (!parent) {
                console.warn(`Could not find parent node for ${ingredient.name}`);
                return false;
              }
              return true;
            });
            
          console.log(`Connecting ${ingredient.name} to parents:`, 
            parentNodes.map(p => p.name).join(', '));
          
          if (parentNodes.length === 0) return;

          // Calculate node depth (minimum parent depth + 1)
          const parentDepths = parentNodes.map(p => nodeDepths.get(p.id) ?? 2);
          const depth = Math.min(...parentDepths) + 1;
          nodeDepths.set(node.id, depth);
          
          // Update the node's depth property
          node.depth = depth;

          // Calculate average position of all parents
          const avgParentPos = parentNodes.reduce(
            (acc, parent) => {
              return [
                acc[0] + parent.position[0],
                acc[1] + parent.position[1],
                acc[2] + parent.position[2]
              ];
            },
            [0, 0, 0]
          ).map(coord => coord / parentNodes.length) as [number, number, number];
          
          // Count siblings at this depth
          const siblingsAtDepth = Array.from(nodeMap.values())
            .filter(n => nodeDepths.get(n.id) === depth)
            .length;
          
          // Calculate position with spacing based on depth and sibling count
          const depthScale = 1 + (depth * 0.8); // Increase spacing with depth
          const baseRadius = 4 * depthScale;
          const verticalSpacing = 3 * depthScale;
          
          // Use a combination of depth and node ID for consistent angle calculation
          const angleSeed = simpleHash(`${node.id}-${depth}`);
          const angle = (angleSeed % 360) * (Math.PI / 180) + 
                       (siblingsAtDepth * (Math.PI * 2 / 8));
          
          // Calculate position in a spiral pattern
          const radius = baseRadius * (1 + (siblingsAtDepth * 0.2));
          const offsetX = Math.cos(angle) * radius;
          const offsetZ = Math.sin(angle) * radius;
          
          // Position the node above the average parent position
          node.position = [
            avgParentPos[0] + offsetX,
            avgParentPos[1] + verticalSpacing, // Higher for deeper nodes
            avgParentPos[2] + offsetZ
          ];
          
          // Connect to all parents
          parentNodes.forEach(parentNode => {
            if (!parentNode.children.includes(node.id)) {
              parentNode.children.push(node.id);
            }
            
            // Add edge with a curved path
            edges.push({
              sourceId: parentNode.id,
              targetId: node.id,
              sourcePosition: parentNode.position,
              targetPosition: node.position,
              color: '#9ca3af'
            });
            
            // Update the position in the map
            positionMap.set(node.id, [...node.position]);
          });
        };

        // Process ingredients in order of increasing complexity (fewer parents first)
        const sortedIngredients = [...ingredients]
          .sort((a, b) => (a.parentIngredients?.length || 0) - (b.parentIngredients?.length || 0));
          
        sortedIngredients.forEach(ingredient => processNode(ingredient));

        // Run force-directed layout simulation
        runForceSimulation(nodeMap, edges);

        // Connect dishes to their base ingredients
        // This function is currently unused but kept for future implementation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const connectDishToBaseIngredient = (
          dishNode: FoodNode, 
          ingredients: Ingredient[],
          nodeMap: Map<string, FoodNode>,
          newEdges: Edge[]
        ) => {
          const baseIngredient = ingredients.find(i => 
            i.name.length > 3 && // Avoid matching very short words
            dishNode.name.toLowerCase().includes(i.name.toLowerCase()) &&
            i.id !== dishNode.id
          );
          
          if (baseIngredient) {
            const baseNode = nodeMap.get(baseIngredient.id);
            if (baseNode) {
              // Position the dish above the base ingredient
              dishNode.position = [
                baseNode.position[0],
                baseNode.position[1] + 3,
                baseNode.position[2]
              ];
              
              newEdges.push({
                sourceId: baseNode.id,
                targetId: dishNode.id,
                sourcePosition: baseNode.position,
                targetPosition: dishNode.position,
                color: '#9ca3af'
              });
            }
          }
        };

        // Create final nodes array with all nodes
        const finalNodes = [rootNode, plantNode, animalNode, otherNode, ...allIngredientNodes];
        
        console.log('Final nodes to render:', finalNodes);
        console.log('Final edges to render:', edges);
        
        // Add all nodes to the node map
        [rootNode, plantNode, animalNode, otherNode, ...allIngredientNodes].forEach(node => {
          nodeMap.set(node.id, node);
          positionMap.set(node.id, node.position);
        });

        // Update state with the final nodes and edges
        if (isSubscribed && isMounted.current) {
          setNodes(finalNodes);
          setEdges(edges);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isSubscribed && isMounted.current) {
          console.error('Error loading food tree data:', err);
          setError('Failed to load food tree data. Please try again later.');
        }
      } finally {
        if (isSubscribed && isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [fetchIngredients]);
  
  // Clean up simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        cancelAnimationFrame(simulationRef.current);
        simulationRef.current = undefined;
      }
    };
  }, []);

  // Memoize the nodes and edges to prevent unnecessary re-renders
  const memoizedNodes = useMemo(() => nodes, [nodes.length, JSON.stringify(nodes)]);
  const memoizedEdges = useMemo(() => edges, [edges.length, JSON.stringify(edges)]);

  return { 
    nodes: memoizedNodes, 
    edges: memoizedEdges, 
    isLoading, 
    error 
  };

  function runForceSimulation(nodeMap: Map<string, FoodNode>, edges: Edge[]) {
    // Convert node map to array for easier iteration
    const nodesArray = Array.from(nodeMap.values());
    
    // Initialize velocities and forces
    const velocities = new Map<string, [number, number, number]>();
    const forces = new Map<string, [number, number, number]>();
    
    // Initialize velocities and forces for all nodes
    nodesArray.forEach(node => {
      velocities.set(node.id, [0, 0, 0]);
      forces.set(node.id, [0, 0, 0]);
    });

    // Run simulation
    let iteration = 0;
    const step = () => {
      // Clear forces for all nodes
      nodesArray.forEach(node => {
        forces.set(node.id, [0, 0, 0]);
      });

      // Apply repulsion between all pairs of nodes
      for (let i = 0; i < nodesArray.length; i++) {
        const node1 = nodesArray[i];
        const force1 = forces.get(node1.id);
        if (!force1) continue;
        
        for (let j = i + 1; j < nodesArray.length; j++) {
          const node2 = nodesArray[j];
          const force2 = forces.get(node2.id);
          if (!force2) continue;
          
          // Calculate distance between nodes
          const dx = node1.position[0] - node2.position[0];
          const dy = node1.position[1] - node2.position[1];
          const dz = node1.position[2] - node2.position[2];
          const distanceSquared = dx * dx + dy * dy + dz * dz;
          const distance = Math.max(0.1, Math.sqrt(distanceSquared));
          
          // Calculate base repulsion force (inverse square law)
          let repulsion = REPULSION_STRENGTH * FORCE_STRENGTH / distanceSquared;
          
          // Apply extra repulsion for main nodes (Plant, Animal, Other)
          const isMainNode1 = node1.type === 'root' || node1.name.toLowerCase() === 'plant' || 
                            node1.name.toLowerCase() === 'animal' || node1.name.toLowerCase() === 'other';
          const isMainNode2 = node2.type === 'root' || node2.name.toLowerCase() === 'plant' || 
                            node2.name.toLowerCase() === 'animal' || node2.name.toLowerCase() === 'other';
          
          if (isMainNode1 || isMainNode2) {
            repulsion *= MAIN_NODE_REPULSION_MULTIPLIER;
          }
          
          // Update forces with a small epsilon to prevent division by zero
          const epsilon = 1e-6;
          const forceFactor = repulsion / (distance + epsilon);
          
          // Update forces for node1
          force1[0] += dx * forceFactor;
          force1[1] += dy * forceFactor;
          force1[2] += dz * forceFactor;
          
          // Update forces for node2 (equal and opposite)
          force2[0] -= dx * forceFactor;
          force2[1] -= dy * forceFactor;
          force2[2] -= dz * forceFactor;
        }
      }

      // Apply spring forces between connected nodes
      edges.forEach(edge => {
        const sourceNode = nodeMap.get(edge.sourceId);
        const targetNode = nodeMap.get(edge.targetId);
        
        if (!sourceNode || !targetNode) return;
        
        const sourceForce = forces.get(sourceNode.id);
        const targetForce = forces.get(targetNode.id);
        
        if (!sourceForce || !targetForce) return;
        
        // Calculate distance between nodes
        const dx = targetNode.position[0] - sourceNode.position[0];
        const dy = targetNode.position[1] - sourceNode.position[1];
        const dz = targetNode.position[2] - sourceNode.position[2];
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        const distance = Math.max(0.1, Math.sqrt(distanceSquared));
        
        // Calculate spring force (Hooke's law)
        const springForce = SPRING_STRENGTH * FORCE_STRENGTH * (distance - SPRING_LENGTH);
        
        // Update forces with a small epsilon to prevent division by zero
        const epsilon = 1e-6;
        const forceFactor = springForce / (distance + epsilon);
        
        // Update forces for source node
        sourceForce[0] += dx * forceFactor;
        sourceForce[1] += dy * forceFactor;
        sourceForce[2] += dz * forceFactor;
        
        // Update forces for target node (equal and opposite)
        targetForce[0] -= dx * forceFactor;
        targetForce[1] -= dy * forceFactor;
        targetForce[2] -= dz * forceFactor;
      });

      // Update velocities and positions
      nodesArray.forEach(node => {
        const velocity = velocities.get(node.id);
        const force = forces.get(node.id);
        
        // Skip if velocity or force is not found (shouldn't happen, but better safe than sorry)
        if (!velocity || !force) return;
        
        // Safely update velocity (F = ma, but we assume mass = 1)
        velocity[0] = ((velocity[0] || 0) + (force[0] || 0)) * VELOCITY_DECAY;
        velocity[1] = ((velocity[1] || 0) + (force[1] || 0)) * VELOCITY_DECAY;
        velocity[2] = ((velocity[2] || 0) + (force[2] || 0)) * VELOCITY_DECAY;
        
        // Limit maximum velocity
        const speed = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1] + velocity[2] * velocity[2]);
        if (speed > MAX_VELOCITY) {
          velocity[0] = (velocity[0] / speed) * MAX_VELOCITY;
          velocity[1] = (velocity[1] / speed) * MAX_VELOCITY;
          velocity[2] = (velocity[2] / speed) * MAX_VELOCITY;
        }
        
        // Update position
        node.position[0] += velocity[0];
        node.position[1] += velocity[1];
        node.position[2] += velocity[2];
      });

      // Update the nodes and edges in the React state with new positions
      if (isMounted.current) {
        // Update node positions
        const updatedNodes = Array.from(nodeMap.values()).map(node => ({
          ...node,
          position: [...node.position] as [number, number, number]
        }));
        
        // Update edge positions
        const updatedEdges = edges.map(edge => {
          const sourceNode = nodeMap.get(edge.sourceId);
          const targetNode = nodeMap.get(edge.targetId);
          
          if (!sourceNode || !targetNode) return edge;
          
          return {
            ...edge,
            sourcePosition: [...sourceNode.position] as [number, number, number],
            targetPosition: [...targetNode.position] as [number, number, number]
          };
        });
        
        // Batch state updates
        setNodes(updatedNodes);
        setEdges(updatedEdges);
      }

      // Continue simulation if not done
      iteration++;
      if (iteration < ITERATIONS) {
        simulationRef.current = requestAnimationFrame(step);
      }
    };

    // Start the simulation
    step();
  }
};

