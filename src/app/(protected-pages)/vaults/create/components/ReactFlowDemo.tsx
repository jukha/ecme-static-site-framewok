'use client';

import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    useEdgesState,
    useNodesState,
} from 'reactflow';

import 'reactflow/dist/style.css';


const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Vault Configuration' }, type: 'input' },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'API Keys' } },
  { id: '3', position: { x: 250, y: 200 }, data: { label: 'Database Credentials' }, type: 'output' },
  { id: '4', position: { x: 500, y: 150 }, data: { label: 'Secrets Management' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'contains' },
  { id: 'e1-3', source: '1', target: '3', label: 'has' },
  { id: 'e2-4', source: '2', target: '4', label: 'uses' },
  { id: 'e3-4', source: '3', target: '4', label: 'configures' },
];

interface ReactFlowDemoProps {
  height?: string;
}

const ReactFlowDemo: React.FC<ReactFlowDemoProps> = ({ height = '600px' }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    console.log('ReactFlow Nodes:', nodes);
    console.log('ReactFlow Edges:', edges);
  }, [nodes, edges]);

  return (
    <div style={{ width: '100%', height: height, border: '1px solid #ccc', borderRadius: '4px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView 
        attributionPosition="bottom-left"
      >
        <MiniMap />
        <Controls />
        <Background  gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowDemo;