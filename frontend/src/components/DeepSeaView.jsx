import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DeepSeaView() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const maskRef = useRef(null);
  
  // Refs for the package cards
  const pkg1Ref = useRef(null);
  const pkg2Ref = useRef(null);
  const pkg3Ref = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (!containerRef.current || !imageRef.current || !maskRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      // 1. Initial State: Bright water, dark container
      // As we scroll, we zoom in slightly, and the mask gets darker (simulating going deeper)
      
      tl.to(imageRef.current, {
        scale: 1.1,
        yPercent: 10,
        ease: 'none',
        duration: 3
      }, 0);

      // Darken the mask to simulate descending into the abyss
      tl.to(maskRef.current, {
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        duration: 2
      }, 0);

      // Package 1 (Sunlight) fades out quickly
      tl.to(pkg1Ref.current, { y: -100, opacity: 0, duration: 0.5 }, 0);
      
      // Package 2 (Twilight) fades in then out
      tl.fromTo(pkg2Ref.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.5);
      tl.to(pkg2Ref.current, { y: -100, opacity: 0, duration: 0.5 }, 1.5);
      
      // Package 3 (Abyssal) fades in at the very bottom
      tl.fromTo(pkg3Ref.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 2);
      
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ height: '300vh', width: '100%', position: 'relative', background: '#020617' }}>
      
      {/* Fixed Background covering the viewport */}
      <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        
        {/* The 2D Parallax Image */}
        <div 
          ref={imageRef}
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            width: '110%',
            height: '110%',
            backgroundImage: 'url(/deep_sea_package.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform',
          }}
        />
        
        {/* The Darkening Mask */}
        <div 
          ref={maskRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(14, 165, 233, 0.2)', // Starts bright blue
            pointerEvents: 'none',
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Title Overlay */}
        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10, color: '#fff', pointerEvents: 'none' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>Descend.</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.8, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Scroll to explore deeper packages.</p>
        </div>

        {/* Package Information Cards */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, width: '100%', maxWidth: '600px', pointerEvents: 'none' }}>
          
          <div ref={pkg1Ref} style={{ position: 'absolute', width: '100%', textAlign: 'center' }}>
             <div style={{ background: 'rgba(248, 250, 252, 0.9)',  padding: '2rem', borderRadius: '16px', color: '#0f172a', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800 }}>Sunlight Starter</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#0ea5e9', fontWeight: 700 }}>$49/mo</p>
                <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>The perfect bright start. Includes a basic sofa, coffee table, and bed frame. Ideal for small apartments and studio living.</p>
             </div>
          </div>

          <div ref={pkg2Ref} style={{ position: 'absolute', width: '100%', textAlign: 'center', opacity: 0 }}>
             <div style={{ background: 'rgba(15, 23, 42, 0.8)',  padding: '2rem', borderRadius: '16px', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800 }}>Twilight Premium</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#3b82f6', fontWeight: 700 }}>$129/mo</p>
                <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: 1.5 }}>Deeper comfort. Upgraded memory foam mattresses, velvet sectional sofas, and 4K smart TVs. Perfect for a 1BHK upgrade.</p>
             </div>
          </div>

          <div ref={pkg3Ref} style={{ position: 'absolute', width: '100%', textAlign: 'center', opacity: 0 }}>
             <div style={{ background: 'rgba(2, 6, 23, 0.9)',  padding: '2rem', borderRadius: '16px', color: '#f8fafc', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>Abyssal Signature</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#34d399', fontWeight: 700 }}>$299/mo</p>
                <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: 1.5 }}>Total luxury in the darkest depths. Features hyper-premium ergonomic furniture, 8K OLED displays, and smart home integration.</p>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
