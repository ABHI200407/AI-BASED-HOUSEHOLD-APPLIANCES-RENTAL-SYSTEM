import React, { useEffect } from 'react';
import './CreativeEffects.css';

const Orb = ({ style }) => <div className="orb" style={style} />;

export default function AmbientOrbs() {
  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 32) return; // Throttle to ~30fps
      lastTime = now;
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`);
      document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Orb style={{ top: '10%', left: '5%', background: 'rgba(0,255,255,.2)' }} />
      <Orb style={{ top: '65%', left: '70%', background: 'rgba(255,165,0,.2)' }} />
      <Orb style={{ top: '40%', left: '35%', background: 'rgba(255,0,255,.15)' }} />
    </>
  );
}
