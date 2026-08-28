import React from 'react';
import useWorkspaceStore from '../store/useWorkspaceStore';
import { History } from 'lucide-react';

export default function TimeSlider() {
  const { history, timeIndex, scrubTime } = useWorkspaceStore();
  
  if (history.length <= 1) return null; // No history to scrub

  return (
    <div style={{
      position: 'absolute',
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '400px',
      background: 'rgba(20, 20, 20, 0.9)',
      padding: '16px 24px',
      borderRadius: '24px',
      border: '1px solid #333',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backdropFilter: 'blur(10px)',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><History size={14} /> Time Engine</span>
        <span>{timeIndex === history.length - 1 ? 'Live' : `T - ${history.length - 1 - timeIndex}`}</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max={history.length - 1} 
        value={timeIndex}
        onChange={(e) => scrubTime(parseInt(e.target.value))}
        style={{
          width: '100%',
          cursor: 'pointer',
          accentColor: '#3b82f6'
        }}
      />
    </div>
  );
}
