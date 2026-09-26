import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DeliveryStoryView() {
  const containerRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);

  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      // Initially, Image 1 is visible (z-index 3), Image 2 (z-index 2), Image 3 (z-index 1)
      // As we scroll, Image 1 fades out, revealing Image 2.
      // Then Image 2 fades out, revealing Image 3.
      
      // Text 1 fades out
      tl.to(text1Ref.current, { opacity: 0, y: -50, duration: 1 }, 0);
      
      // Image 1 fades out to reveal Image 2
      tl.to(image1Ref.current, { opacity: 0, scale: 1.1, duration: 2 }, 0.5);
      
      // Text 2 fades in then out
      tl.fromTo(text2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 1);
      tl.to(text2Ref.current, { opacity: 0, y: -50, duration: 1 }, 3);

      // Image 2 fades out to reveal Image 3
      tl.to(image2Ref.current, { opacity: 0, scale: 1.1, duration: 2 }, 3.5);

      // Text 3 fades in
      tl.fromTo(text3Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 4);
      
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ height: '300vh', width: '100%', position: 'relative', background: '#020617' }}>
      
      {/* Sticky Container */}
      <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        
        {/* Images layer */}
        <div 
          ref={image3Ref}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: 'url(/downloaded_images/services/delivery/delivery_011_pid5217124.jpg)', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 1
          }}
        />
        <div 
          ref={image2Ref}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: 'url(/downloaded_images/services/delivery/delivery_006_pid7217785.jpg)', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 2, willChange: 'opacity, transform'
          }}
        />
        <div 
          ref={image1Ref}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: 'url(/downloaded_images/services/delivery/delivery_002_pid5933476.jpg)', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 3, willChange: 'opacity, transform'
          }}
        />
        
        {/* Darkening Mask for legibility & editorial tone */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'linear-gradient(180deg, rgba(15,23,32,0.55) 0%, rgba(15,23,32,0.3) 40%, rgba(15,23,32,0.75) 100%)', 
          zIndex: 4 
        }} />

        {/* Floating Quick Jump to Tracking */}
        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 10 }}>
          <button 
            onClick={() => {
              const el = document.getElementById('installations-tracking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              padding: '0.75rem 1.4rem',
              borderRadius: '99px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <span>View My Orders &amp; Tracking</span> ↓
          </button>
        </div>

        {/* Text Overlays layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          
          <div ref={text1Ref} style={{ position: 'absolute', textAlign: 'center', color: '#fff', padding: '0 2rem', maxWidth: '780px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#818cf8', background: 'rgba(99, 102, 241, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '99px', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
              Phase 01 • Staging &amp; Quality Audit
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '3.5rem', fontWeight: 800, margin: '1.25rem 0 0.75rem', textShadow: '0 8px 30px rgba(0,0,0,0.8)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Inspected, Sealed &amp; Dispatched.
            </h2>
            <p style={{ fontSize: '1.15rem', opacity: 0.92, maxWidth: '580px', margin: '0 auto', lineHeight: 1.6, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              Every appliance and designer piece passes a rigorous multi-point functional diagnostic before loading into our specialized transit fleet.
            </p>
          </div>

          <div ref={text2Ref} style={{ position: 'absolute', textAlign: 'center', color: '#fff', padding: '0 2rem', maxWidth: '780px', opacity: 0 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#34d399', background: 'rgba(52, 211, 153, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '99px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              Phase 02 • White-Glove Doorstep Transit
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '3.5rem', fontWeight: 800, margin: '1.25rem 0 0.75rem', textShadow: '0 8px 30px rgba(0,0,0,0.8)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Safe, Scheduled Room Placement.
            </h2>
            <p style={{ fontSize: '1.15rem', opacity: 0.92, maxWidth: '580px', margin: '0 auto', lineHeight: 1.6, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              Our uniformed logistics crew safely navigates elevators, tight doorways, and stairs to place your furniture exactly where you want it.
            </p>
          </div>

          <div ref={text3Ref} style={{ position: 'absolute', textAlign: 'center', color: '#fff', padding: '0 2rem', maxWidth: '780px', opacity: 0 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '99px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              Phase 03 • Certified Installation
            </span>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '3.5rem', fontWeight: 800, margin: '1.25rem 0 0.75rem', textShadow: '0 8px 30px rgba(0,0,0,0.8)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Turnkey Assembly &amp; Power On.
            </h2>
            <p style={{ fontSize: '1.15rem', opacity: 0.92, maxWidth: '580px', margin: '0 auto', lineHeight: 1.6, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              From mounting brackets and gas lines to bed frames and dining suites—certified technicians assemble, level, and test everything before departure.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
