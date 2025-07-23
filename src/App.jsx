
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
import downloadImage from './utils/export2png';

const initialNodes = [
  {
    id: '1001',
    type: 'CustomNode',
    data: {
      label: 'Start',
      type: 'start',
      description: 'Start node',
    },
    position: { x: 250, y: 5 },
  },
  {
    id: '1002',
    type: 'CustomNode',
    data: {
      label: 'Agent',
      type: 'agent',
      description: 'Agent node',
    },
    position: { x: 250, y: 150 },
  },
  {
    id: '1003',
    type: 'CustomNode',
    data: {
      label: 'End',
      type: 'end',
      description: 'End node',
    },
    position: { x: 250, y: 300 },
  },
];

const flowKey = 'example-flow';

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [rfInstance, setRfInstance] = useState(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const copiedNodesRef = useRef([]);
  const { setViewport, screenToFlowPosition, getNodes } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      CustomNode: (props) => <CustomNode {...props} setNodes={setNodes} />,
    }),
    [setNodes]
  );

  // Function to generate a 4-digit ID
  const generateNodeId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

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
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();

  }, [setNodes, setViewport]);


  const onExport = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log('Exported flow:', JSON.stringify(flow));
    }
  }, [rfInstance]);

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
          type: data.type,
          description: data.label, // Default description to label
        },
      };

      setNodes((nds) => nds.concat(newNode));

    },
    [screenToFlowPosition, setNodes]
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
            };

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
    <div className="smithflow">
      <Header onSave={onSave} onLoad={onLoad} onExport={onExport} />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <Sidebar />
        <div className="reactflow-wrapper" style={{ width: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={nodeTypes}
            fitViewOptions={{ maxZoom: 1 }}
            deleteKeyCode={['Backspace', 'Delete']}
            className='bg-teal-50'
            onInit={setRfInstance}
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


