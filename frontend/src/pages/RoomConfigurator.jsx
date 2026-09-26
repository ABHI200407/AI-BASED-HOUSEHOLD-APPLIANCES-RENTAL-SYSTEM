import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Palette } from 'lucide-react';

const COLORS = [
  { name: 'Matte Black', value: '#1a1a1a' },
  { name: 'Arctic White', value: '#f5f5f5' },
  { name: 'Space Grey', value: '#505050' },
  { name: 'Cobalt Blue', value: '#1a4b8c' },
];

function ConfigurableObject({ color }) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

export default function RoomConfigurator() {
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Canvas Context */}
      <div style={{ flex: 1, position: 'absolute', inset: 0, zIndex: 1, background: '#f0f0f5' }}>
        <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={2048} />
          <Environment preset="city" />
          
          <ConfigurableObject color={selectedColor.value} />
          
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} enablePan={false} enableZoom={true} />
        </Canvas>
      </div>

      {/* Floating Header UI */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)', padding: '12px 24px',
            borderRadius: '999px', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Settings size={18} />
          {isConfigOpen ? 'Close Configurator' : 'Customize Item'}
        </motion.button>
      </div>

      {/* Tylko-Style Sliding Configurator Panel */}
      <AnimatePresence>
        {isConfigOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute', top: 20, right: 20, bottom: 20,
              width: '380px', zIndex: 10,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', gap: '32px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Configuration</h2>
              <button 
                onClick={() => setIsConfigOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#444' }}>
                <Palette size={18} />
                <span>Material & Finish</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: selectedColor.value === color.value ? '2px solid #5c45fd' : '1px solid #ddd',
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: color.value, border: '1px solid rgba(0,0,0,0.1)' 
                    }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '4px' }}>Total Price</div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>$149<span style={{ fontSize: '1rem', color: '#888' }}>/mo</span></div>
              </div>
              <button style={{
                background: '#5c45fd', color: '#fff', padding: '16px',
                borderRadius: '16px', border: 'none', fontWeight: 700,
                fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(92, 69, 253, 0.3)'
              }}>
                Add to Rental Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
