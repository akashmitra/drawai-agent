import { create } from 'zustand';

const useNodeStore = create((set) => ({
  nodeNames: [],
  setNodeNames: (names) => set({ nodeNames: names }),
}));

export default useNodeStore;
