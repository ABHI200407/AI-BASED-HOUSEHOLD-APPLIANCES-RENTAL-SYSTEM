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
            backgroundImage: 'url(/indian_doorstep_delivery.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 1
          }}
        />
        <div 
          ref={image2Ref}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: 'url(/indian_delivery_van_driving.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 2, willChange: 'opacity, transform'
          }}
        />
        <div 
          ref={image1Ref}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: 'url(/indian_logistics_warehouse.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 3, willChange: 'opacity, transform'
          }}
        />
        
        {/* Darkening Mask for legibility */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 4 }} />

        {/* Text Overlays layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          
          <div ref={text1Ref} style={{ position: 'absolute', textAlign: 'center', color: '#fff', padding: '0 2rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#38bdf8' }}>Step 1: Preparation</span>
            <h2 style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>Dispatched with Care.</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              From our world-class Indian warehouses, your premium furniture is inspected, sealed, and loaded into our dedicated fleet.
            </p>
          </div>

          <div ref={text2Ref} style={{ position: 'absolute', textAlign: 'center', color: '#fff', padding: '0 2rem', opacity: 0 }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#10b981' }}>Step 2: Transit</span>
            <h2 style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>Sustainable Delivery.</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              Our modern EV cargo vans navigate the bustling city, ensuring rapid, zero-emission transit to your location.
            </p>
          </div>

          <div ref={text3Ref} style={{ position: 'absolute', textAlign: 'center', color: '#fff', padding: '0 2rem', opacity: 0 }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#f59e0b' }}>Step 3: Arrival</span>
            <h2 style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>Seamless Setup.</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
              Delivered straight to your doorstep by our professional crew. Unboxing and setup are handled completely by us.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
