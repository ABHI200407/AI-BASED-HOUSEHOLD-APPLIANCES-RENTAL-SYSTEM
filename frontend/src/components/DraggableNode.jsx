import React from 'react';
import { useGesture } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';
import useWorkspaceStore from '../store/useWorkspaceStore';
import { Database, Box, Play, LayoutGrid } from 'lucide-react';

export default function DraggableNode({ node }) {
  const { updateNodePosition, commitNodePosition, updateNodeStatus } = useWorkspaceStore();

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      updateNodePosition(node.id, x, y);
    },
    onDragEnd: () => {
      commitNodePosition();
    }
  }, {
    drag: { from: () => [node.x, node.y] }
  });

  const getIcon = () => {
    switch(node.type) {
      case 'dataset': return <Database size={16} />;
      case 'model': return <Box size={16} />;
      case 'project': return <LayoutGrid size={16} />;
      default: return <Box size={16} />;
    }
  };

  const getStatusColor = () => {
    switch(node.status) {
      case 'New': return '#3b82f6'; // blue
      case 'Ready': return '#10b981'; // green
      case 'Training': return '#f59e0b'; // orange
      case 'Offline': return '#6b7280'; // gray
      default: return '#6b7280';
    }
  };

  const handleDoubleClick = () => {
    // Evolve object on double click to test physical transformation
    if (node.type === 'model' && node.status === 'Offline') {
      updateNodeStatus(node.id, 'Training');
    } else if (node.type === 'model' && node.status === 'Training') {
      updateNodeStatus(node.id, 'Ready');
    }
  };

  return (
    <motion.div
      {...bind()}
      layoutId={`node-${node.id}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: node.x,
        y: node.y,
        background: 'rgba(20, 20, 20, 0.8)',
        border: `1px solid ${getStatusColor()}`,
        borderRadius: '8px',
        padding: node.status === 'Training' ? '24px' : '12px 16px',
        color: '#fff',
        cursor: 'grab',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: node.status === 'Training' ? '250px' : '150px',
        
        boxShadow: `0 0 20px ${getStatusColor()}20`
      }}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
    >
      <motion.div layout="position" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
        {getIcon()}
        {node.label}
      </motion.div>
      
      <AnimatePresence>
        {node.status === 'Training' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Epoch 32/50</span>
              <span style={{ color: '#10b981' }}>Loss: 0.21</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#374151', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div 
                animate={{ width: ['0%', '100%'] }} 
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ height: '100%', background: '#f59e0b' }} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout="position" style={{ fontSize: '10px', color: getStatusColor(), textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
        ● {node.status}
      </motion.div>
    </motion.div>
  );
}
