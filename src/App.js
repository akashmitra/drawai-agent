import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FaArrowCircleRight, FaArrowCircleLeft, FaCog } from 'react-icons/fa';

import Sidebar from './Sidebar';
import Header from './Header';
import CustomNode from './CustomNode';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Input', icon: <FaArrowCircleRight /> },
    position: { x: 250, y: 5 },
  },
];

const nodeTypes = {
  custom: CustomNode,
};

const iconMap = {
  FaArrowCircleRight: <FaArrowCircleRight />,
  FaArrowCircleLeft: <FaArrowCircleLeft />,
  FaCog: <FaCog />,
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState([]);
  const copiedNodesRef = useRef([]);
  const { screenToFlowPosition, getNodes, setNodes: setFlowNodes, setEdges: setFlowEdges } = useReactFlow();

  // const onNodeLabelChange = useCallback((id, newLabel) => {
  //   setNodes((nds) =>
  //     nds.map((node) =>
  //       node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
  //     )
  //   );
  // }, [setNodes]);

  const onSave = useCallback(async () => {
    const flow = { nodes, edges };
    try {
      const response = await fetch('http://localhost:3001/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flow),
      });
      const data = await response.json();
      console.log(data.message);
      alert('Diagram saved!');
    } catch (error) {
      console.error('Error saving diagram:', error);
      alert('Error saving diagram.');
    }
  }, [nodes, edges]);

  const onLoad = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/load');
      const data = await response.json();
      setFlowNodes(data.nodes || []);
      setFlowEdges(data.edges || []);
      alert('Diagram loaded!');
    } catch (error) {
      console.error('Error loading diagram:', error);
      alert('Error loading diagram.');
    }
  }, [setFlowNodes, setFlowEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const data = JSON.parse(event.dataTransfer.getData('application/json'));


      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: { label: data.label, icon: iconMap[data.icon] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyKeyPressed = isMac ? event.metaKey : event.ctrlKey;

      if (copyKeyPressed && event.key === 'c') {
        const selectedNodes = getNodes().filter((node) => node.selected);
        if (selectedNodes.length > 0) {
          copiedNodesRef.current = selectedNodes;
        }
      }

      if (copyKeyPressed && event.key === 'v') {
        if (copiedNodesRef.current.length > 0) {
          const newNodes = copiedNodesRef.current.map((node) => {
            const newNode = { ...node };
            newNode.id = `${+new Date() + Math.random()}`;
            newNode.position = {
              x: node.position.x + 20,
              y: node.position.y + 20,
            };
            newNode.selected = false;
            return newNode;
          });
          setNodes((nds) => nds.concat(newNodes));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [getNodes, setNodes]);


  return (
    <div className="dndflow">
      <Header/>
      <div style={{display: 'flex', height: 'calc(100vh - 60px)'}}>
        <Sidebar />
        <div className="reactflow-wrapper" style={{ width: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            fitViewOptions={{ maxZoom: 1 }}
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default App;