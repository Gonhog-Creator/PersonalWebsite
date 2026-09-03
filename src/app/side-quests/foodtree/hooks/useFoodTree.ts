'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

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
  depth: number;
  highlighted?: boolean;
  source?: string;
}

export interface Edge {
  sourceId: string;
  targetId: string;
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
  color: string;
}

interface ApiIngredient {
  id: string;
  name: string;
  source: string;
  animal_type: string | null;
  is_source_animal: boolean;
  preparation_method: string | null;
  parent_ingredient_ids: string[];
}

interface ApiDish {
  id: string;
  name: string;
  cooking_method: string | null;
  ingredients: Array<{ ingredientId: string; amount?: string; notes?: string }>;
}

const CATEGORY_POSITIONS: Record<string, [number, number, number]> = {
  plant: [0, 8, -5],
  animal: [-6, 8, 5],
  other: [6, 8, 5],
};

const CATEGORY_COLORS: Record<string, string> = {
  plant: '#86efac',
  animal: '#fca5a5',
  other: '#93c5fd',
};

const INGREDIENT_COLORS: Record<string, string> = {
  plant: '#4ade80',
  animal: '#f87171',
  other: '#60a5fa',
};

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

function generateRadialPositions(
  count: number,
  center: [number, number, number],
  radius: number,
  seed: string
): [number, number, number][] {
  if (count === 0) return [];
  const r = radius * (1 + Math.log1p(count) * 0.3);
  const angleStep = (Math.PI * 2) / Math.max(1, count);
  const baseAngle = (simpleHash(seed) % 360) * (Math.PI / 180);

  return Array.from({ length: count }, (_, i) => {
    const angle = baseAngle + angleStep * i - (count > 1 ? Math.PI / 2 : 0);
    const yOffset = Math.sin(angle * 1.5) * 0.5;
    return [
      center[0] + Math.cos(angle) * r,
      center[1] + yOffset,
      center[2] + Math.sin(angle) * r,
    ] as [number, number, number];
  });
}

export const useFoodTree = () => {
  const [nodes, setNodes] = useState<FoodNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [ingRes, dishRes] = await Promise.all([
          fetch('/api/foodtree/ingredients'),
          fetch('/api/foodtree/dishes'),
        ]);

        if (!ingRes.ok) throw new Error('Failed to fetch ingredients');
        const ingredients: ApiIngredient[] = await ingRes.json();
        const dishes: ApiDish[] = dishRes.ok ? await dishRes.json() : [];

        // Build category nodes
        const rootNode: FoodNode = {
          id: 'root',
          name: 'Food Tree',
          type: 'root',
          children: ['plant', 'animal', 'other'],
          position: [0, 0, 0],
          color: '#9ca3af',
          size: 1.2,
          depth: 0,
        };

        const categoryNodes: FoodNode[] = ['plant', 'animal', 'other'].map(cat => ({
          id: cat,
          name: cat === 'plant' ? '🌱 Plant' : cat === 'animal' ? '🐄 Animal' : '🧂 Other',
          type: cat as NodeType,
          children: [],
          position: CATEGORY_POSITIONS[cat],
          color: CATEGORY_COLORS[cat],
          size: 1.0,
          depth: 1,
        }));

        // Group ingredients by source
        const byCategory: Record<string, ApiIngredient[]> = {
          plant: [],
          animal: [],
          other: [],
        };
        for (const ing of ingredients) {
          const cat = ['plant', 'animal', 'other'].includes(ing.source) ? ing.source : 'plant';
          byCategory[cat].push(ing);
        }

        // Position ingredients radially around their category node
        const ingredientNodes: FoodNode[] = [];
        const nodeMap = new Map<string, FoodNode>();
        categoryNodes.forEach(n => nodeMap.set(n.id, n));

        for (const [cat, ings] of Object.entries(byCategory)) {
          const positions = generateRadialPositions(
            ings.length,
            CATEGORY_POSITIONS[cat],
            3 + Math.min(ings.length * 0.15, 3),
            cat
          );

          ings.forEach((ing, i) => {
            const node: FoodNode = {
              id: ing.id,
              name: ing.name,
              type: 'ingredient',
              children: [],
              parentIngredients: ing.parent_ingredient_ids,
              position: positions[i],
              color: INGREDIENT_COLORS[cat] || '#60a5fa',
              size: 0.5,
              depth: 2,
              source: ing.source,
            };
            ingredientNodes.push(node);
            nodeMap.set(node.id, node);

            // Connect to category
            const catNode = nodeMap.get(cat);
            if (catNode) catNode.children.push(node.id);
          });
        }

        // Build edges: root -> categories, categories -> ingredients
        const allEdges: Edge[] = [];

        for (const catNode of categoryNodes) {
          allEdges.push({
            sourceId: 'root',
            targetId: catNode.id,
            sourcePosition: rootNode.position,
            targetPosition: catNode.position,
            color: catNode.color,
          });
        }

        for (const ingNode of ingredientNodes) {
          const cat = ingNode.source || 'plant';
          const catNode = nodeMap.get(cat);
          if (catNode) {
            allEdges.push({
              sourceId: cat,
              targetId: ingNode.id,
              sourcePosition: catNode.position,
              targetPosition: ingNode.position,
              color: CATEGORY_COLORS[cat] || '#93c5fd',
            });
          }
        }

        // Add dish nodes connected to their ingredients
        const dishNodes: FoodNode[] = [];
        for (const dish of dishes) {
          const dishNode: FoodNode = {
            id: dish.id,
            name: dish.name,
            type: 'dish',
            children: [],
            position: [0, 14, 0],
            color: '#fbbf24',
            size: 0.6,
            depth: 3,
          };
          dishNodes.push(dishNode);
          nodeMap.set(dishNode.id, dishNode);

          // Connect dish to its ingredients
          for (const ingRef of dish.ingredients) {
            const ingNode = nodeMap.get(ingRef.ingredientId);
            if (ingNode) {
              allEdges.push({
                sourceId: ingNode.id,
                targetId: dishNode.id,
                sourcePosition: ingNode.position,
                targetPosition: dishNode.position,
                color: '#fbbf24',
              });
            }
          }
        }

        // Connect parent ingredient relationships
        for (const ing of ingredients) {
          if (!ing.parent_ingredient_ids?.length) continue;
          const childNode = nodeMap.get(ing.id);
          if (!childNode) continue;

          for (const parentId of ing.parent_ingredient_ids) {
            const parentNode = nodeMap.get(parentId);
            if (parentNode) {
              allEdges.push({
                sourceId: parentNode.id,
                targetId: childNode.id,
                sourcePosition: parentNode.position,
                targetPosition: childNode.position,
                color: '#9ca3af',
              });
              if (!parentNode.children.includes(childNode.id)) {
                parentNode.children.push(childNode.id);
              }
            }
          }
        }

        const allNodes = [rootNode, ...categoryNodes, ...ingredientNodes, ...dishNodes];

        if (isMounted.current) {
          setNodes(allNodes);
          setEdges(allEdges);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : 'Failed to load food tree data');
        }
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);

  return { nodes: memoizedNodes, edges: memoizedEdges, isLoading, error };
};
