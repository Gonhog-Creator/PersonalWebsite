'use client';

import React, { useRef, useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useFoodTree, type Edge, type FoodNode } from '../hooks/useFoodTree';

interface NodeProps {
  node: FoodNode;
  onClick: (node: FoodNode) => void;
}

const Node: React.FC<NodeProps> = ({ node, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  const isHighlighted = node.highlighted;
  const showHoverEffect = hovered && !isHighlighted;
  const nodeColor = showHoverEffect ? 'hotpink' : node.color;
  const nodeScale = showHoverEffect ? 1.2 : 1;

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(node)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={nodeScale}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial color={nodeColor} roughness={0.4} metalness={0.3} />
      </mesh>

      {isHighlighted && (
        <mesh>
          <sphereGeometry args={[node.size * 1.1, 32, 32]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.8} wireframe />
        </mesh>
      )}

      <Billboard position={[0, -node.size - 0.3, 0]} follow>
        <Text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          outlineOpacity={0.8}
        >
          {node.name}
        </Text>
      </Billboard>
    </group>
  );
};

interface EdgeLineProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
  highlighted?: boolean;
}

const EdgeLine: React.FC<EdgeLineProps> = ({ start, end, color = 'white', highlighted = false }) => {
  const lineGeometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 + 2, (start.z + end.z) / 2),
      end
    );
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [start, end]);

  return (
    // @ts-expect-error R3F <line> conflicts with SVG <line> in TypeScript
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={highlighted ? '#ffd700' : color}
        linewidth={highlighted ? 2 : 1}
        opacity={highlighted ? 1 : 0.6}
        transparent={!highlighted}
      />
    </line>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const FoodTree = React.memo(({ nodes, edges, onNodeClick }: {
  nodes: FoodNode[];
  edges: Edge[];
  onNodeClick: (node: FoodNode) => void;
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  const getAncestorIds = useCallback((nodeId: string, nodeMap: Map<string, FoodNode>): string[] => {
    const visited = new Set<string>();
    const queue: string[] = [nodeId];
    const allAncestors = new Set<string>([nodeId]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const parentNodes = Array.from(nodeMap.values()).filter(node => node.children.includes(currentId));
      parentNodes.forEach(parent => {
        if (!allAncestors.has(parent.id)) {
          allAncestors.add(parent.id);
          queue.push(parent.id);
        }
      });
    }

    return Array.from(allAncestors);
  }, []);

  const handleNodeClick = useCallback((node: FoodNode) => {
    onNodeClick(node);

    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
      setHighlightedNodes(new Set());
      return;
    }

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const ancestorIds = getAncestorIds(node.id, nodeMap);
    setSelectedNodeId(node.id);
    setHighlightedNodes(new Set(ancestorIds));
  }, [nodes, onNodeClick, selectedNodeId, getAncestorIds]);

  const nodeHighlightMap = useMemo(() => {
    const map = new Map<string, boolean>();
    nodes.forEach(node => map.set(node.id, highlightedNodes.has(node.id)));
    return map;
  }, [nodes, highlightedNodes]);

  const isEdgeHighlighted = useCallback((edge: Edge) =>
    highlightedNodes.has(edge.sourceId) && highlightedNodes.has(edge.targetId),
  [highlightedNodes]);

  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      (camera as THREE.PerspectiveCamera).aspect = width / height;
      camera.updateProjectionMatrix();
      gl.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl]);

  const { processedNodes, memoizedEdges } = useMemo(() => {
    const processedNodes = nodes.map(node => (
      <Node
        key={node.id}
        node={{ ...node, highlighted: nodeHighlightMap.get(node.id) || false }}
        onClick={handleNodeClick}
      />
    ));

    const memoizedEdges = edges.map((edge, index) => (
      <EdgeLine
        key={`${edge.sourceId}-${edge.targetId}-${index}`}
        start={new THREE.Vector3(...edge.sourcePosition)}
        end={new THREE.Vector3(...edge.targetPosition)}
        color={edge.color}
        highlighted={isEdgeHighlighted(edge)}
      />
    ));

    return { processedNodes, memoizedEdges };
  }, [nodes, edges, nodeHighlightMap, handleNodeClick, isEdgeHighlighted]);

  return (
    <ErrorBoundary>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      {processedNodes}
      {memoizedEdges}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom
        enablePan
        minDistance={3}
        maxDistance={100}
        zoomSpeed={0.8}
        rotateSpeed={0.8}
        panSpeed={1.2}
        screenSpacePanning
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={0}
      />
    </ErrorBoundary>
  );
});

FoodTree.displayName = 'FoodTree';

export { FoodTree };

export const FoodTree3D = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FoodNode | null>(null);
  const { nodes, edges, isLoading, error: foodTreeError } = useFoodTree();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (foodTreeError) setError(foodTreeError);
  }, [foodTreeError]);

  useEffect(() => {
    if (isClient && nodes.length === 0 && !isLoading) {
      setError('No data available. Please add some ingredients first.');
    } else if (error && nodes.length > 0) {
      setError(null);
    }
  }, [nodes, isLoading, error, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading 3D viewer...</div>
      </div>
    );
  }

  const handleNodeClick = (node: FoodNode) => {
    const fullNode = nodes.find(n => n.id === node.id);
    setSelectedNode(fullNode || node);
  };

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-400">Loading food tree data...</div>
        </div>
      ) : (
        <div className="w-full h-full">
          <Canvas
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
            camera={{ position: [0, 15, 25], fov: 40, near: 0.1, far: 1000 }}
            onCreated={({ gl }) => {
              gl.setClearColor('#1a1a1a');
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }}
          >
            <Suspense fallback={null}>
              <ErrorBoundary>
                <FoodTree nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
              </ErrorBoundary>
            </Suspense>
          </Canvas>

          {selectedNode && (
            <div className="absolute top-4 right-4 bg-black/90 text-white p-5 rounded-lg max-w-xs border border-gray-600 shadow-lg">
              <div className="flex justify-between items-start mb-3 px-4">
                <h3 className="text-lg font-bold text-gray-100">{selectedNode.name}</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1 -mr-2 -mt-2"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-sm text-gray-300 mb-4 px-4">
                {selectedNode.type === 'dish' ? 'Dish' : 'Ingredient'}
              </div>

              {selectedNode.parentIngredients && selectedNode.parentIngredients.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700 px-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Made with:</h4>
                  <ul className="space-y-2">
                    {selectedNode.parentIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-2 flex-shrink-0" />
                        <span className="text-gray-200 text-sm leading-relaxed">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
