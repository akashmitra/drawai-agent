import { create } from 'zustand';

// Function to generate a 4-digit ID
const generateNodeId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const useNodeStore = create((set, get) => ({
  // Store all nodes as an object with node_id as key
  nodes: {},
  
  // Generate a new 4-digit node ID
  generateNodeId: () => generateNodeId(),
  
  // Add a new node
  addNode: (node) => set((state) => ({
    nodes: {
      ...state.nodes,
      [node.node_id]: {
        node_id: node.node_id,
        node_name: node.node_name,
        node_type: node.node_type,
        connect_to: node.connect_to || [],
        connect_from: node.connect_from || [],
        instructions: node.instructions || '',
        tools: node.tools || [],
        description: node.description || '',
      }
    }
  })),
  
  // Update an existing node
  updateNode: (node_id, updates) => set((state) => ({
    nodes: {
      ...state.nodes,
      [node_id]: {
        ...state.nodes[node_id],
        ...updates
      }
    }
  })),
  
  // Update node label by ID
  updateNodeLabel: (node_id, newLabel) => set((state) => ({
    nodes: {
      ...state.nodes,
      [node_id]: {
        ...state.nodes[node_id],
        node_name: newLabel
      }
    }
  })),
  
  // Update node description by ID
  updateNodeDescription: (node_id, newDescription) => set((state) => ({
    nodes: {
      ...state.nodes,
      [node_id]: {
        ...state.nodes[node_id],
        description: newDescription
      }
    }
  })),
  
  // Remove a node
  removeNode: (node_id) => set((state) => {
    const newNodes = { ...state.nodes };
    delete newNodes[node_id];
    return { nodes: newNodes };
  }),
  
  // Get a specific node
  getNode: (node_id) => get().nodes[node_id],
  
  // Get all nodes
  getAllNodes: () => get().nodes,
  
  // Clear all nodes
  clearNodes: () => set({ nodes: {} }),
  
  // Update node connections
  updateNodeConnections: (node_id, connect_to, connect_from) => set((state) => ({
    nodes: {
      ...state.nodes,
      [node_id]: {
        ...state.nodes[node_id],
        connect_to: connect_to || state.nodes[node_id].connect_to,
        connect_from: connect_from || state.nodes[node_id].connect_from,
      }
    }
  })),
  
  // Update node tools
  updateNodeTools: (node_id, tools) => set((state) => ({
    nodes: {
      ...state.nodes,
      [node_id]: {
        ...state.nodes[node_id],
        tools: tools || state.nodes[node_id].tools,
      }
    }
  })),
}));

export default useNodeStore;