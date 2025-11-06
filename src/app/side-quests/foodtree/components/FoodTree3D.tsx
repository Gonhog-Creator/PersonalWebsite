'use client';

import React, { useRef, useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Billboard } from '@react-three/drei'; // Removed unused Sphere import
import * as THREE from 'three';
import { useFoodTree } from '../hooks/useFoodTree';

type NodeType = 'ingredient' | 'dish' | 'root';

interface FoodNode {
  id: string;
  name: string;
  type: NodeType;
  children: string[];
  parentIngredients?: string[];
  position: [number, number, number];
  color: string;
  size: number;
}

interface NodeProps {
  node: FoodNode;
  onClick: (node: FoodNode) => void;
  key?: string; // Add key to the props interface
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

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(node)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? 'hotpink' : node.color} 
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      <Billboard
        position={[0, -node.size - 0.3, 0]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
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

interface EdgeProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
  edgeKey?: string;
}

const Edge: React.FC<EdgeProps> = ({ start, end, color = 'white' }) => {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start.x, start.y, start.z),
      new THREE.Vector3(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2 + 2,
        (start.z + end.z) / 2
      ),
      new THREE.Vector3(end.x, end.y, end.z)
    );
    return curve.getPoints(20);
  }, [start.x, start.y, start.z, end.x, end.y, end.z]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} linewidth={1} />
    </line>
  );
};

interface FoodTreeProps {
  nodes: FoodNode[];
  edges: Edge[];
  onNodeClick: (node: FoodNode) => void;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, { hasError: boolean }> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in FoodTree:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Or render a fallback UI
    }
    return this.props.children;
  }
}

// FoodTree component for rendering the 3D food tree
const FoodTree = React.memo(({ nodes, edges, onNodeClick }: FoodTreeProps) => {
  const { camera, gl } = useThree(); // Removed unused scene variable
  const [contextLost, setContextLost] = useState(false);

  // Log nodes to check if parentIngredients are present
  useEffect(() => {
    console.log('FoodTree nodes:', nodes);
  }, [nodes]);
  
  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      console.warn('WebGL Context Lost', event);
      event.preventDefault();
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL Context Restored');
      setContextLost(false);
    };

    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  // Set up camera and renderer
  useEffect(() => {
    if (contextLost) return;
    
    // Position camera to view the entire graph - zoomed out
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    
    // Configure WebGL renderer with conservative settings
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    gl.setPixelRatio(pixelRatio);
    gl.setSize(window.innerWidth, window.innerHeight);
    
    // Set up resize handler
    const handleResize = () => {
      if (contextLost) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      gl.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera, gl, contextLost]);

  // Process nodes and edges in a single useMemo to maintain hook order
  const { processedNodes, memoizedEdges } = useMemo(() => {
    if (!nodes) return { processedNodes: [], memoizedEdges: [] };

    console.log('Raw nodes from useFoodTree:', nodes);
    console.log('Node types:', nodes.map(n => `${n.name} (${n.type})`));
    console.log('Node count:', nodes.length);
    console.log('Edge count:', edges.length);
    console.log('Edges:', edges.map(e => `${e.sourceId} -> ${e.targetId}`));
    
    const processedNodes = nodes.map((node) => (
      <Node 
        key={node.id}
        node={{
          ...node,
          parentIngredients: node.parentIngredients || []
        }}
        onClick={onNodeClick}
      />
    ));

    const memoizedEdges = edges.map((edge, index) => (
      <Edge
        key={`${edge.sourceId}-${edge.targetId}-${index}`}
        start={new THREE.Vector3(...edge.sourcePosition)}
        end={new THREE.Vector3(...edge.targetPosition)}
        color={edge.color}
      />
    ));

    return { processedNodes, memoizedEdges };
  }, [nodes, edges, onNodeClick]);

  if (contextLost) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      {processedNodes}
      {memoizedEdges}
      <OrbitControls
        enableDamping={true}
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={50}
        zoomSpeed={0.5}
      />
    </ErrorBoundary>
  );
});

// Add display name for better debugging
FoodTree.displayName = 'FoodTree';

export { FoodTree }; // Export the FoodTree component

export const FoodTree3D = () => {
  // All hooks must be called at the top level
  const isMounted = useRef(true);
  const [key, setKey] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FoodNode | null>(null);
  const { nodes, edges, isLoading, error: foodTreeError } = useFoodTree();
  const [error, setError] = useState<string | null>(null);
  
  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const handleRetry = useCallback(() => {
    // Force remount the Canvas component
    setKey(prev => prev + 1);
  }, []);
  
  // Handle food tree errors
  useEffect(() => {
    if (foodTreeError) {
      setError(foodTreeError);
    }
  }, [foodTreeError]);
  
  // Log node and edge counts for debugging
  useEffect(() => {
    if (isClient) {
      console.log('FoodTree3D - Node count:', nodes.length);
      console.log('FoodTree3D - Edge count:', edges.length);
      
      if (nodes.length === 0 && !isLoading) {
        setError('No data available. Please add some ingredients first.');
      } else if (error && nodes.length > 0) {
        setError(null);
      }
    }
  }, [nodes, edges, isLoading, error, isClient]);
  
  // Don't render the Canvas during SSR or initial client-side render
  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading 3D viewer...</div>
      </div>
    );
  }

  const handleNodeClick = (node: FoodNode) => {
    console.log('Node clicked:', node);
    // Find the full node data from the nodes array to ensure we have all properties
    const fullNode = nodes.find(n => n.id === node.id);
    if (fullNode) {
      console.log('Full node data:', fullNode);
      setSelectedNode({
        ...fullNode,
        parentIngredients: fullNode.parentIngredients || []
      });
    } else {
      setSelectedNode(node);
    }
  };

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Check the browser console for more details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-600">Loading food tree data...</div>
        </div>
      ) : (
        <div className="w-full h-full" key={`canvas-container-${key}`}>
          <Canvas
            key={`canvas-${key}`}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              preserveDrawingBuffer: true,
              failIfMajorPerformanceCaveat: false,
              depth: true,
              premultipliedAlpha: false,
            }}
            dpr={[1, 2]}
            camera={{ position: [0, 15, 25], fov: 40, near: 0.1, far: 1000 }}
            onCreated={({ gl, canvas }) => {
              try {
                // Set up WebGL context
                gl.setClearColor('#1a1a1a');
                gl.shadowMap.enabled = false;
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                // Store original context loss function
                const originalForceContextLoss = gl.forceContextLoss;
                
                // Override forceContextLoss to prevent context loss
                gl.forceContextLoss = () => {
                  console.log('Context loss prevented');
                  return false;
                };
                
                // Safely add event listeners
                if (canvas) {
                  const handleContextLost = (event: Event) => {
                    console.log('WebGL Context Lost');
                    event.preventDefault();
                    // Force a re-render to recover
                    setKey(prev => prev + 1);
                  };
                  
                  canvas.addEventListener('webglcontextlost', handleContextLost, false);
                  
                  // Cleanup function
                  return () => {
                    canvas.removeEventListener('webglcontextlost', handleContextLost);
                    // Restore original function
                    gl.forceContextLoss = originalForceContextLoss;
                  };
                }
              } catch (error) {
                console.error('Error initializing WebGL:', error);
                setError('Failed to initialize 3D viewer. Please try refreshing the page.');
              }
            }}
            onError={(error) => {
              console.error('WebGL Error:', error);
              setError(`Failed to initialize 3D view: ${error.message}`);
            }}
          >
          <Suspense fallback={null}>
            <ErrorBoundary>
              <FoodTree 
                nodes={nodes} 
                edges={edges} 
                onNodeClick={handleNodeClick}
              />
            </ErrorBoundary>
          </Suspense>
          </Canvas>
          
          <div className="absolute bottom-4 right-4">
            <button 
              onClick={handleRetry}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
              title="Reset 3D View"
            >
              ⟳ Reset View
            </button>
          </div>
        </div>
      )}
            {selectedNode && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-white p-5 rounded-lg max-w-xs border border-gray-600 shadow-lg">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-2 flex-shrink-0"></span>
                      <span className="text-gray-200 text-sm leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
