import { create } from 'zustand';

export const useNodeStore = create((set, get) => ({
  // Store all nodes as an object with node_id as key
  nodes: {},
  
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