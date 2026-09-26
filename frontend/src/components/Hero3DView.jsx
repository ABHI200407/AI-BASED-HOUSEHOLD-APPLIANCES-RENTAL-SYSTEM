import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CreativeEffects.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero3DView() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (!containerRef.current || !imageRef.current) return;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
      
      // Scale and pan the image down as user scrolls
      tl.to(imageRef.current, { 
        yPercent: 30,
        scale: 1.1,
        ease: "none"
      }, 0);

      // Fade out the overlay text
      if (textRef.current) {
        tl.to(textRef.current, {
          y: -50,
          opacity: 0,
          ease: "none"
        }, 0);
      }
      
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ 
      width: '100%', 
      height: '100%', 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      <div 
        ref={imageRef}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '110%',
          height: '120%',
          backgroundImage: 'url(/luxury_sofa.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />
      {/* Optional cinematic gradient overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, rgba(248, 250, 252, 1) 0%, rgba(248, 250, 252, 0) 100%)'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(to bottom, rgba(248, 250, 252, 1) 0%, rgba(248, 250, 252, 0) 100%)'
      }} />
    </div>
  );
}
