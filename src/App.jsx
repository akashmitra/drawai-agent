import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  MiniMap,
  getNodesBounds,
  getViewportForBounds,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FaArrowCircleRight, FaArrowCircleLeft, FaCog } from 'react-icons/fa';
import { toPng } from 'html-to-image';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CustomNode from './components/CustomNode';
import useNodeStore from './utils/store';
import downloadImage from './utils/export2png';

const nodeTypes = {
  CustomNode: CustomNode,
};

const iconMap = {
  FaArrowCircleRight: <FaArrowCircleRight />,
  FaArrowCircleLeft: <FaArrowCircleLeft />,
  FaCog: <FaCog />,
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const copiedNodesRef = useRef([]);
  const { screenToFlowPosition, getNodes, setNodes: setFlowNodes, setEdges: setFlowEdges } = useReactFlow();
  
  const addNodeToStore = useNodeStore((state) => state.addNode);
  const getAllNodesFromStore = useNodeStore((state) => state.getAllNodes);
  const clearNodesFromStore = useNodeStore((state) => state.clearNodes);
  const generateNodeId = useNodeStore((state) => state.generateNodeId);
  const updateNodeLabel = useNodeStore((state) => state.updateNodeLabel);
  const updateNodeDescription = useNodeStore((state) => state.updateNodeDescription);

  const onNodeLabelChange = useCallback((id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
    // Update the store using the node ID
    updateNodeLabel(id, newLabel);
  }, [setNodes, updateNodeLabel]);

  const onNodeDescriptionChange = useCallback((id, newDescription) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, description: newDescription } } : node
      )
    );
    // Update the store using the node ID
    updateNodeDescription(id, newDescription);
  }, [setNodes, updateNodeDescription]);

  // Initialize nodes with callbacks and add to store
  useEffect(() => {
    clearNodesFromStore();
    const initialNodes = [
      {
        id: '1001',
        type: 'CustomNode',
        data: {
          label: 'Start',
          icon: <FaArrowCircleRight />,
          description: 'Start node',
          onNodeLabelChange,
          onNodeDescriptionChange
        },
        position: { x: 250, y: 5 },
      },
      {
        id: '1002',
        type: 'CustomNode',
        data: {
          label: 'Agent',
          icon: <FaCog />,
          description: 'Agent node',
          onNodeLabelChange,
          onNodeDescriptionChange
        },
        position: { x: 250, y: 150 },
      },
      {
        id: '1003',
        type: 'CustomNode',
        data: {
          label: 'End',
          icon: <FaArrowCircleLeft />,
          description: 'End node',
          onNodeLabelChange,
          onNodeDescriptionChange
        },
        position: { x: 250, y: 300 },
      },
    ];
    setNodes(initialNodes);
    // Add to store
    initialNodes.forEach((n) => {
      addNodeToStore({
        node_id: n.id,
        node_name: n.data.label,
        node_type: n.type,
        connect_to: [],
        connect_from: [],
        instructions: '',
        tools: [],
        description: n.data.description || '',
      });
    });
  }, [setNodes, onNodeLabelChange, onNodeDescriptionChange, addNodeToStore, clearNodesFromStore]);


  const onSave = useCallback(async () => {

    const imageWidth = 1024;
    const imageHeight = 768;

    try {
      const nodesBounds = getNodesBounds(getNodes());
      const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

      toPng(document.querySelector('.react-flow__viewport'), {
        width: imageWidth,
        height: imageHeight,
        style: {
          width: imageWidth,
          height: imageHeight,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      }).then(downloadImage);
      console.log('Diagram saved!');

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

  // Update onExport to export the new node structure
  const onExport = useCallback(() => {
    const allNodes = getAllNodesFromStore();
    console.log('Store Export (JSON):', JSON.stringify(allNodes, null, 2));
  }, [getAllNodesFromStore]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // When a new node is dropped, add it to the store as well
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

      // Generate a 4-digit ID for the new node
      const newNodeId = generateNodeId();

      const newNode = {
        id: newNodeId,
        type,
        position,
        data: {
          label: data.label,
          icon: iconMap[data.icon],
          description: data.label, // Default description to label
          onNodeLabelChange,
          onNodeDescriptionChange
        },
      };

      setNodes((nds) => nds.concat(newNode));
      // Add to store
      addNodeToStore({
        node_id: newNodeId,
        node_name: data.label,
        node_type: type,
        connect_to: [],
        connect_from: [],
        instructions: '',
        tools: [],
        description: data.label,
      });
    },
    [screenToFlowPosition, setNodes, generateNodeId, onNodeLabelChange, onNodeDescriptionChange, addNodeToStore],
  );

  // When copying nodes, add to store as well
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
            // Generate a new 4-digit ID for copied nodes
            newNode.id = generateNodeId();
            newNode.position = {
              x: node.position.x + 20,
              y: node.position.y + 20,
            };
            newNode.selected = false;
            // Add callbacks to copied nodes
            newNode.data = {
              ...newNode.data,
              onNodeLabelChange,
              onNodeDescriptionChange
            };
            // Add to store
            addNodeToStore({
              node_id: newNode.id,
              node_name: newNode.data.label,
              node_type: newNode.type,
              connect_to: [],
              connect_from: [],
              instructions: '',
              tools: [],
              description: newNode.data.description || '',
            });
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
  }, [getNodes, setNodes, generateNodeId, onNodeLabelChange, onNodeDescriptionChange, addNodeToStore]);

  return (
    <div className="smithflow">
      <Header onSave={onSave} onLoad={onLoad} onExport={onExport} />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
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
            nodeTypes={nodeTypes}
            fitViewOptions={{ maxZoom: 1 }}
            deleteKeyCode={['Backspace', 'Delete']}
            className='bg-teal-50'
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