import { create } from 'zustand';

const useWorkspaceStore = create((set, get) => ({
  nodes: [
    { id: '1', type: 'project', label: 'Computer Vision', x: 0, y: 0, status: 'New' },
    { id: '2', type: 'dataset', label: 'Road Damage (12k)', x: -300, y: 200, status: 'Ready' },
    { id: '3', type: 'model', label: 'YOLOv8', x: 300, y: 200, status: 'Offline' },
  ],
  history: [
    [
      { id: '1', type: 'project', label: 'Computer Vision', x: 0, y: 0, status: 'New' },
      { id: '2', type: 'dataset', label: 'Road Damage (12k)', x: -300, y: 200, status: 'Ready' },
      { id: '3', type: 'model', label: 'YOLOv8', x: 300, y: 200, status: 'Offline' },
    ]
  ],
  timeIndex: 0, // Points to the index in history we are currently viewing
  isScrubbing: false,

  saveHistory: () => {
    set((state) => {
      // If we made a change while scrubbing, we truncate the future
      const newHistory = state.history.slice(0, state.timeIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.nodes)));
      return {
        history: newHistory,
        timeIndex: newHistory.length - 1,
        isScrubbing: false
      };
    });
  },

  updateNodePosition: (id, x, y) => {
    set((state) => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, x, y } : n)
    }));
  },

  commitNodePosition: () => {
    get().saveHistory();
  },
  
  updateNodeStatus: (id, status) => {
    set((state) => ({
      nodes: state.nodes.map(n => n.id === id ? { ...n, status } : n)
    }));
    get().saveHistory();
  },

  scrubTime: (index) => {
    set((state) => {
      if (index < 0 || index >= state.history.length) return state;
      return {
        timeIndex: index,
        nodes: JSON.parse(JSON.stringify(state.history[index])),
        isScrubbing: index !== state.history.length - 1
      };
    });
  },
}));

export default useWorkspaceStore;
