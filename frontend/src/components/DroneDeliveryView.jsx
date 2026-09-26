import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DroneDeliveryView() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (!containerRef.current || !imageRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Drone parallax effect: scale down and pan right as user scrolls down
      tl.fromTo(imageRef.current, 
        { scale: 1.2, xPercent: -5 },
        { scale: 1, xPercent: 5, ease: 'none' }
      );
      
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative', background: '#0f172a', overflow: 'hidden' }}>
      <div 
        ref={imageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: '-5%',
          width: '110%',
          height: '100%',
          backgroundImage: 'url(/drone_delivery.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      />
      
      {/* Overlay text */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Kinetic<br/>Logistics
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '400px', marginTop: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Autonomous parcel delivery bringing your rentals directly to your designated drop zone. 
        </p>
      </div>
      
      {/* Cinematic gradient overlays for text readability and blending */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '50%',
        background: 'linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
