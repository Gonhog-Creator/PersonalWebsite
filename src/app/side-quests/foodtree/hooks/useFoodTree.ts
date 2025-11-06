'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export type NodeType = 'ingredient' | 'dish' | 'root' | 'grown' | 'gathered';

export interface FoodNode {
  id: string;
  name: string;
  type: NodeType;
  children: string[];
  parentIngredients?: string[];
  position: [number, number, number];
  color: string;
  size: number;
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
const FORCE_STRENGTH = 0.7; // Overall force strength
const REPULSION_STRENGTH = 0.6; // How strongly nodes repel each other
const SPRING_STRENGTH = 0.05; // How strongly connected nodes attract
const SPRING_LENGTH = 3; // Optimal distance between connected nodes
const VELOCITY_DECAY = 0.6; // How quickly nodes slow down
const MAX_VELOCITY = 10; // Maximum velocity a node can have
const ITERATIONS = 100; // Number of simulation steps to run

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
  const getIngredientCategory = (ingredient: { foodType?: string }): 'grown' | 'gathered' => {
    return ingredient.foodType === 'gathered' ? 'gathered' : 'grown';
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
  const categorizeIngredient = (ingredient: CategorizableIngredient): 'grown' | 'gathered' => {
    return ingredient.foodType === 'gathered' ? 'gathered' : 'grown';
  };

  // Fetch and transform data into nodes and edges
  useEffect(() => {
    const controller = new AbortController();
    let isSubscribed = true;
    
    const loadData = async () => {
      try {
        const ingredients = await fetchIngredients();
        if (!isSubscribed || !isMounted.current) return;

        // Create root nodes
        const rootNode: FoodNode = {
          id: 'root',
          name: 'Food Tree',
          type: 'root',
          children: [],
          position: [0, 0, 0],  // Root at the bottom center
          color: '#4F46E5',
          size: 0.8
        };

        const grownNode: FoodNode = {
          id: 'grown',
          name: 'Grown',
          type: 'grown',
          children: [],
          position: [-5, 3, 0],  // Positioned above and to the left of root
          color: '#10b981',
          size: 0.7
        };

        const gatheredNode: FoodNode = {
          id: 'gathered',
          name: 'Gathered',
          type: 'gathered',
          children: [],
          position: [5, 3, 0],  // Positioned above and to the right of root
          color: '#3b82f6',
          size: 0.7
        };

        // Create ingredient nodes
        const ingredientNodes: FoodNode[] = [];
        const nodeMap = new Map<string, FoodNode>();
        
        // Separate ingredients into categories
        const grownIngredients = ingredients.filter(ing => 
          categorizeIngredient(ing) === 'grown');
        const gatheredIngredients = ingredients.filter(ing => 
          categorizeIngredient(ing) === 'gathered');
        console.log('Grown ingredients:', grownIngredients);
        console.log('Gathered ingredients:', gatheredIngredients);
        
        // Generate positions for each category in a circle
        // Grown items on the left, Gathered on the right
        // Use larger base radius for categories with more items
        const grownBaseRadius = 3 + Math.min(grownIngredients.length * 0.2, 2);
        const gatheredBaseRadius = 3 + Math.min(gatheredIngredients.length * 0.2, 2);
        
        const grownPositions = generatePositions(grownIngredients.length, -6, 4, grownBaseRadius, 'grown');
        const gatheredPositions = generatePositions(gatheredIngredients.length, 6, 4, gatheredBaseRadius, 'gathered');
        
        // Track node positions to prevent overlap
        const positionMap = new Map<string, [number, number, number]>();
        
        // Process all ingredients with their categories
        const processIngredients = (ingredients: Ingredient[], positions: [number, number, number][], category: 'grown' | 'gathered') => {
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
            
            // Determine color - orange for dishes, green for all ingredients
            const color = isDish ? '#f59e0b' : '#10b981'; // Orange for dishes, green for ingredients
            
            const node: FoodNode = {
              id: ingredient.id,
              name: ingredient.name,
              type: (ingredient.type || 'ingredient') as NodeType,
              children: [],
              parentIngredients: ingredient.parentIngredients || [],
              position: [...basePosition],
              color,
              size: isDish ? 0.6 : 0.5
            };
            
            console.log(`Created ${category} node:`, node);
            
            positionMap.set(ingredient.id, [...node.position]);
            nodeMap.set(ingredient.id, node);
            return node;
          }).filter(Boolean) as FoodNode[];
        };
        
        // Process ingredients from each category
        const processedGrown = processIngredients(grownIngredients, grownPositions, 'grown');
        const processedGathered = processIngredients(gatheredIngredients, gatheredPositions, 'gathered');
        
        // Combine all nodes
        const allIngredientNodes = [...processedGrown, ...processedGathered];
        console.log('Processed grown:', processedGrown);
        console.log('Processed gathered:', processedGathered);
        console.log('All ingredient nodes:', allIngredientNodes);
        
        ingredientNodes.push(...allIngredientNodes);
        console.log('Ingredient nodes after push:', ingredientNodes);

        // Create edges
        const newEdges: Edge[] = [
          // Connect root to category nodes
          {
            sourceId: 'root',
            targetId: 'grown',
            sourcePosition: rootNode.position,
            targetPosition: grownNode.position,
            color: '#6b7280'
          },
          {
            sourceId: 'root',
            targetId: 'gathered',
            sourcePosition: rootNode.position,
            targetPosition: gatheredNode.position,
            color: '#6b7280'
          }
        ];
        
        // First pass: Connect all ingredients to their categories based on their type
        ingredientNodes.forEach(node => {
          const ingredient = ingredients.find(i => i.id === node.id);
          if (!ingredient) return;
          
          // Determine the category based on the ingredient's foodType
          const foodType = ingredient.foodType || 'grown';
          
          // Only connect to category nodes if this is a root ingredient (no parent ingredients)
          // or if it's a base ingredient that should be connected to a category
          const shouldConnectToCategory = !ingredient.parentIngredients?.length || 
                                       (ingredient.parentIngredients?.length === 0);
          
          if (shouldConnectToCategory && (foodType === 'grown' || foodType === 'gathered')) {
            const isGrown = foodType === 'grown';
            const categoryId = isGrown ? 'grown' : 'gathered';
            const categoryNode = isGrown ? grownNode : gatheredNode;
            
            // Only add the edge if the node is actually positioned
            if (node.position && node.position.every(coord => coord !== undefined)) {
              newEdges.push({
                sourceId: categoryId,
                targetId: node.id,
                sourcePosition: categoryNode.position,
                targetPosition: node.position,
                color: isGrown ? '#86efac' : '#93c5fd' // Lighter green/blue for edges
              });
              
              // Add to the category's children if not already there
              if (isGrown && !grownNode.children.includes(node.id)) {
                grownNode.children.push(node.id);
              } else if (!isGrown && !gatheredNode.children.includes(node.id)) {
                gatheredNode.children.push(node.id);
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

          // Calculate node depth (max parent depth + 1)
          const parentDepths = parentNodes.map(p => nodeDepths.get(p.id) ?? 0);
          const depth = Math.max(...parentDepths) + 1;
          nodeDepths.set(node.id, depth);

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
            newEdges.push({
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
        runForceSimulation(nodeMap, newEdges);

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
        const finalNodes = [rootNode, grownNode, gatheredNode, ...ingredientNodes];
        
        console.log('Final nodes to render:', finalNodes);
        console.log('Final edges to render:', newEdges);
        
        // Update state with the final nodes and edges
        if (isSubscribed && isMounted.current) {
          setNodes(finalNodes);
          setEdges(newEdges);
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
      }
    };
  }, []);

  // Memoize the nodes and edges to prevent unnecessary re-renders
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);

  return { 
    nodes: memoizedNodes, 
    edges: memoizedEdges, 
    isLoading, 
    error 
  };

  function runForceSimulation(nodeMap: Map<string, FoodNode>, edges: Edge[]) {
    // Initialize velocities and positions
    const velocities = new Map<string, [number, number, number]>();
    const forces = new Map<string, [number, number, number]>();
    
    // Initialize velocities and forces
    nodeMap.forEach((node) => {
      velocities.set(node.id, [0, 0, 0]);
      forces.set(node.id, [0, 0, 0]);
    });

    // Run simulation
    let iteration = 0;
    const step = () => {
      // Clear forces
      forces.forEach((_, id) => {
        forces.set(id, [0, 0, 0]);
      });

      // Apply repulsion between all pairs of nodes
      const nodesArray = Array.from(nodeMap.values());
      for (let i = 0; i < nodesArray.length; i++) {
        const node1 = nodesArray[i];
        const force1 = forces.get(node1.id)!;
        
        for (let j = i + 1; j < nodesArray.length; j++) {
          const node2 = nodesArray[j];
          const force2 = forces.get(node2.id)!;
          
          // Calculate distance between nodes
          const dx = node1.position[0] - node2.position[0];
          const dy = node1.position[1] - node2.position[1];
          const dz = node1.position[2] - node2.position[2];
          const distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy + dz * dz));
          
          // Calculate repulsion force (inverse square law)
          const repulsion = REPULSION_STRENGTH * FORCE_STRENGTH / (distance * distance);
          
          // Update forces
          force1[0] += (dx / distance) * repulsion;
          force1[1] += (dy / distance) * repulsion;
          force1[2] += (dz / distance) * repulsion;
          
          force2[0] -= (dx / distance) * repulsion;
          force2[1] -= (dy / distance) * repulsion;
          force2[2] -= (dz / distance) * repulsion;
        }
      }

      // Apply spring forces between connected nodes
      edges.forEach(edge => {
        const sourceNode = nodeMap.get(edge.sourceId);
        const targetNode = nodeMap.get(edge.targetId);
        
        if (!sourceNode || !targetNode) return;
        
        const sourceForce = forces.get(sourceNode.id)!;
        const targetForce = forces.get(targetNode.id)!;
        
        // Calculate distance between nodes
        const dx = targetNode.position[0] - sourceNode.position[0];
        const dy = targetNode.position[1] - sourceNode.position[1];
        const dz = targetNode.position[2] - sourceNode.position[2];
        const distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy + dz * dz));
        
        // Calculate spring force (Hooke's law)
        const springForce = SPRING_STRENGTH * FORCE_STRENGTH * (distance - SPRING_LENGTH);
        
        // Update forces
        sourceForce[0] += (dx / distance) * springForce;
        sourceForce[1] += (dy / distance) * springForce;
        sourceForce[2] += (dz / distance) * springForce;
        
        targetForce[0] -= (dx / distance) * springForce;
        targetForce[1] -= (dy / distance) * springForce;
        targetForce[2] -= (dz / distance) * springForce;
      });

      // Update velocities and positions
      nodeMap.forEach((node) => {
        const velocity = velocities.get(node.id)!;
        const force = forces.get(node.id)!;
        
        // Update velocity (F = ma, but we assume mass = 1)
        velocity[0] = (velocity[0] + force[0]) * VELOCITY_DECAY;
        velocity[1] = (velocity[1] + force[1]) * VELOCITY_DECAY;
        velocity[2] = (velocity[2] + force[2]) * VELOCITY_DECAY;
        
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

      // Update the nodes in the React state with new positions
      if (isMounted.current) {
        setNodes(prevNodes => 
          prevNodes.map(node => {
            const updatedNode = nodeMap.get(node.id);
            return updatedNode ? { ...node, position: [...updatedNode.position] } : node;
          })
        );
        setEdges(prevEdges => [...prevEdges]);
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

