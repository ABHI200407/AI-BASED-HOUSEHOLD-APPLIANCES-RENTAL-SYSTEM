import React, { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useNavigate } from 'react-router-dom';

export default function InfiniteCanvas({ children }) {
  const [style, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }));
  const ref = useRef();
  
  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        api.start({ x: dx, y: dy });
      },
      onPinch: ({ offset: [d] }) => {
        api.start({ scale: 1 + d / 200 });
      },
      onWheel: ({ delta: [dx, dy] }) => {
        api.start({ x: style.x.get() - dx, y: style.y.get() - dy });
      }
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { from: () => [(style.scale.get() - 1) * 200, 0] }
    }
  );

  return (
    <div ref={ref} style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#222', touchAction: 'none' }}>
      <animated.div style={{ ...style, width: '300vw', height: '300vh', position: 'relative' }}>
        {/* Background Grid */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Islands */}
        <div style={{ position: 'absolute', top: '50vh', left: '50vw' }}>
          {children}
        </div>
      </animated.div>
    </div>
  );
}

export function CanvasIsland({ x, y, title, link, children }) {
  const navigate = useNavigate();
  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: y, 
        left: x, 
        background: '#fff', 
        padding: '2rem', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        width: '400px',
        cursor: 'pointer'
      }}
      onClick={() => navigate(link)}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>{title}</h3>
      {children}
    </div>
  );
}
