import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function SceneObjects() {
  const group = useRef();
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame((state, delta) => {
    // Ambient floating rotation instead of scroll-hijacking
    ref1.current.rotation.x += delta * 0.2;
    ref1.current.rotation.y += delta * 0.3;
    
    ref2.current.rotation.x -= delta * 0.2;
    ref2.current.rotation.y += delta * 0.1;
    
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={ref1} position={[-2, 0, -2]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#ff4060" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh ref={ref2} position={[2, -1, -5]}>
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial color="#4060ff" roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>
      
      <Float speed={1} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[0, 2, -10]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="#40ff60" wireframe />
        </mesh>
      </Float>
    </group>
  );
}

export default function SceneWalkthrough({ className }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        <SceneObjects />
      </Canvas>
    </div>
  );
}
