import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import { X, ArrowRight, Check } from 'lucide-react';
import * as THREE from 'three';

const STORIES = [
  { id: 1, title: 'The 48-Hour Relocation', price: 'Priya S.', label: 'Bengaluru', color: 'clay', image: '/downloaded_images/living_room/full_room/full_room_001_pid6980724.jpg', items: ['Fast setup', 'Fully furnished', 'Zero hassle'], content: 'Got a job offer on Tuesday, moved on Thursday. Rentova completely furnished my empty 2BHK in Bellandur before my flight even landed. I walked into a home, not a house.' },
  { id: 2, title: 'First Apartment Magic', price: 'Rahul & Aditi', label: 'Mumbai', color: 'ink', image: '/downloaded_images/bedroom/full_room/full_room_001_pid6903157.jpg', items: ['Bedroom set', 'Premium feel', 'Budget friendly'], content: 'Moving out together meant buying a lot of furniture we couldn\'t afford. Renting the "Softer Landing" bedroom set gave us the premium aesthetic we wanted without draining our savings.' },
  { id: 3, title: 'The Nomadic Executive', price: 'Vikram M.', label: 'Gurugram', color: 'olive', image: '/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg', items: ['Mid-century', 'Flexible tenure', '1-click return'], content: 'I jump between cities every 8 months. Rentova is my cheat code. I subscribe to the same mid-century modern aesthetic everywhere I go. Returning furniture is a single click.' },
  { id: 4, title: 'The Growing Family', price: 'Neha T.', label: 'Pune', color: 'clay', image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg', items: ['Kid friendly', 'Easy swaps', 'Durable'], content: 'When the baby arrived, we instantly needed more space and different furniture. We swapped out our glass coffee table for a plush, kid-friendly ottoman and upgraded to a larger sofa seamlessly.' },
  { id: 5, title: 'The Startup Studio', price: 'Karan D.', label: 'Hyderabad', color: 'ink', image: '/downloaded_images/office_furniture/desks/desks_001_pid8369211.jpg', items: ['Ergonomic desk', 'Office chairs', 'No sunk costs'], content: 'Bootstrapping a startup from my living room. I rented three ergonomic office setups and a whiteboard. When we finally get a real office, I\'ll just return them. No sunk costs.' },
  { id: 6, title: 'The Style Swap', price: 'Ananya P.', label: 'Delhi', color: 'olive', image: '/downloaded_images/lifestyle/apartments/apartments_001_pid4792297.jpg', items: ['Aesthetic refresh', 'Living room', 'Vibrant tones'], content: 'I get bored of my decor easily. For Diwali, I used the "Style Swap" feature to change my entire living room from muted greys to vibrant jewel tones. It felt like moving into a new house.' },
  { id: 7, title: 'The Semester Abroad', price: 'Rishabh C.', label: 'Bengaluru', color: 'clay', image: '/downloaded_images/bedroom/beds/beds_001_pid7445084.jpg', items: ['6-month plan', 'No commitment', 'Easy move out'], content: 'Here for a 6-month exchange program. Buying a bed and selling it later seemed exhausting. The 6-month tenure plan was perfectly tailored for temporary residents like me.' },
  { id: 8, title: 'The Empty Nesters', price: 'Mr. & Mrs. Rao', label: 'Chennai', color: 'ink', image: '/downloaded_images/dining_room/dining_tables/dining_tables_001_pid7180275.jpg', items: ['Luxury dining', 'Downsizing', 'No heavy lifting'], content: 'Kids moved out, so we downsized to a beautiful modern apartment. We decided to rent a luxury dining set to host family dinners without committing to buying heavy wooden furniture.' },
  { id: 9, title: 'The Pet-Friendly Pad', price: 'Sneha & Max', label: 'Mumbai', color: 'olive', image: '/downloaded_images/living_room/sofas/sofas_001_pid7587782.jpg', items: ['Pet friendly', 'Free deep clean', 'Durable fabric'], content: 'Got a Golden Retriever puppy. I was terrified of him ruining an expensive sofa. I rented the pet-friendly fabric bundle, which includes free deep cleaning. Best decision ever.' },
  { id: 10, title: 'The Zero-Waste Move', price: 'Arjun K.', label: 'Pune', color: 'clay', image: '/downloaded_images/bedroom/full_room/full_room_001_pid6903157.jpg', items: ['Sustainable', 'Refurbished', 'Zero landfill'], content: 'I hate fast furniture that ends up in landfills. Renting high-quality pieces that get refurbished and reused perfectly aligns with my sustainable lifestyle goals.' }
];

function FloatingCards({ onSelect }) {
  const groupRef = useRef();
  
  const points = useMemo(() => {
    const numPoints = STORIES.length;
    const pts = [];
    const radius = 10; // Spread out more
    
    for (let i = 0; i < numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      // Stagger them slightly up and down so they aren't in a perfect flat line
      const y = Math.sin(theta * 3) * 1.5; 
      const z = Math.sin(theta) * radius;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1; // Rotate faster horizontally
      // Remove X rotation so the circle stays flat
      groupRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => {
        const pack = STORIES[i];
        return (
          <group key={i} position={pos}>
            <Html distanceFactor={18} center transform sprite>
              <article 
                className={`rv-package-card rv-package-card--${pack.color}`} 
                style={{ width: '260px', cursor: 'pointer', pointerEvents: 'auto', transform: 'scale(1)', transition: 'transform 0.3s' }}
                onClick={() => onSelect(pack)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div className="rv-package-card__media">
                  <img src={pack.image} alt="" style={{ height: '200px', objectFit: 'cover', width: '100%' }} />
                  <span>{pack.label}</span>
                </div>
                <div className="rv-package-card__body">
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{pack.title}</h3>
                    <strong>{pack.price}</strong>
                  </div>
                  <ul>{pack.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--rv-color-primary)', marginTop: '1rem', fontSize: '0.875rem' }}>Read the story <ArrowRight size={17} /></div>
                </div>
                <span className="rv-package-card__number">{(i + 1).toString().padStart(2, '0')}</span>
              </article>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function StorySphere() {
  const [selectedStory, setSelectedStory] = useState(null);

  return (
    <div style={{ width: '100%', height: '800px', background: '#ffffff', position: 'relative', overflow: 'hidden', borderRadius: '32px', margin: '4rem 0', border: '1px solid var(--rv-color-border)', zIndex: 1 }}>
      
      {/* Header Overlay */}
      <div style={{ position: 'absolute', top: '3rem', left: '0', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none', padding: '0 2rem' }}>
        <span style={{ display: 'inline-block', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: '1rem' }}>
          The Renter's Journal
        </span>
        <h2 style={{ color: 'var(--rv-color-primary)', fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', marginBottom: '0.5rem', lineHeight: 1 }}>
          Life, arranged.
        </h2>
        <p style={{ color: 'var(--rv-color-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore stories from the Rentova community. Drag to rotate the cloud.
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 30], fov: 40 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <FloatingCards onSelect={setSelectedStory} />
        </Float>

        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Selected Story Overlay */}
      {selectedStory && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(2, 6, 23, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '4rem',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            color: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <button 
              onClick={() => setSelectedStory(null)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} />
            </button>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {selectedStory.label}
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--rv-font-display)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {selectedStory.title}
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '3rem' }}>
              "{selectedStory.content}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
                {selectedStory.price.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{selectedStory.price}</div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Rentova Member</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
