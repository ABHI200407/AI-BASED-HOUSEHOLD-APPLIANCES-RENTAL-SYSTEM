import React, { useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import useWorkspaceStore from '../store/useWorkspaceStore';
import DraggableNode from './DraggableNode';
import TimeSlider from './TimeSlider';
import Omnibar from './Omnibar';

export default function WorldCanvas() {
  const { nodes, isScrubbing } = useWorkspaceStore();
  const [style, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }));
  const containerRef = useRef(null);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        api.start({ x: dx, y: dy });
      },
      onPinch: ({ offset: [d] }) => {
        api.start({ scale: Math.max(0.2, Math.min(1 + d / 200, 3)) });
      },
      onWheel: ({ delta: [dx, dy] }) => {
        api.start({ x: style.x.get() - dx, y: style.y.get() - dy });
      }
    },
    {
      target: containerRef,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { from: () => [(style.scale.get() - 1) * 200, 0] }
    }
  );

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        background: '#0a0a0a', 
        touchAction: 'none',
        position: 'relative'
      }}
    >
      <animated.div 
        style={{ 
          ...style, 
          width: '100%', 
          height: '100%', 
          position: 'absolute',
          transformOrigin: '0 0'
        }}
      >
        {/* Spatial Grid Background */}
        <div style={{
          position: 'absolute', top: -5000, left: -5000, width: 10000, height: 10000,
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          pointerEvents: 'none'
        }} />

        {/* Connections (Phase 3) */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          {nodes.length >= 3 && (
            <>
              {/* Draw line from Dataset to Model */}
              <line 
                x1={nodes[1].x + 75} 
                y1={nodes[1].y + 20} 
                x2={nodes[2].x + 75} 
                y2={nodes[2].y + 20} 
                stroke={nodes[2].status === 'Training' ? '#f59e0b' : '#333'} 
                strokeWidth="2"
                strokeDasharray={nodes[2].status === 'Training' ? "5,5" : "none"}
              />
              {/* Draw line from Project to Dataset */}
              <line 
                x1={nodes[0].x + 75} 
                y1={nodes[0].y + 20} 
                x2={nodes[1].x + 75} 
                y2={nodes[1].y + 20} 
                stroke="#333" 
                strokeWidth="2"
              />
            </>
          )}
        </svg>
        
        {/* Nodes */}
        {nodes.map(node => (
          <DraggableNode key={node.id} node={node} />
        ))}
      </animated.div>

      {/* Control Room HUD Overlays */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: '#666', fontFamily: 'monospace', zIndex: 10 }}>
        <h2>SYSTEM STATUS {isScrubbing ? '● TIMETRAVEL' : '● ONLINE'}</h2>
        <p>Entities: {nodes.length}</p>
      </div>

      <Omnibar />
      <TimeSlider />
    </div>
  );
}
