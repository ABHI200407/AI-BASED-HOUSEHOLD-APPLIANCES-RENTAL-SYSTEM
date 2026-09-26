import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles } from 'lucide-react';
import useWorkspaceStore from '../store/useWorkspaceStore';

export default function Omnibar() {
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState('');
  const { nodes, updateNodeStatus } = useWorkspaceStore();

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase();
      // Simple parser for prototype
      if (cmd.includes('train yolo')) {
        const yoloNode = nodes.find(n => n.label.toLowerCase().includes('yolo'));
        if (yoloNode) {
          updateNodeStatus(yoloNode.id, 'Training');
        }
      }
      setInput('');
      setFocused(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      width: focused ? '600px' : '300px',
      transition: 'width 0.3s ease',
      zIndex: 100
    }}>
      <div style={{
        background: 'rgba(10, 10, 10, 0.9)',
        border: focused ? '1px solid #3b82f6' : '1px solid #333',
        borderRadius: '16px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: focused ? '0 0 30px rgba(59, 130, 246, 0.2)' : 'none',
        
      }}>
        {focused ? <Sparkles size={18} color="#3b82f6" /> : <Terminal size={18} color="#666" />}
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleCommand}
          placeholder="Ask anything or command the system..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            width: '100%',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          }}
        />
      </div>

      <AnimatePresence>
        {focused && input.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid #333',
              borderRadius: '12px',
              marginTop: '8px',
              padding: '16px',
              color: '#aaa',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <span>Interpreting command: <strong>{input}</strong></span>
            {input.toLowerCase().includes('train') && (
              <div style={{ color: '#10b981' }}>↳ Suggestion: Train YOLOv8 on Road Damage Dataset? (Press Enter)</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
