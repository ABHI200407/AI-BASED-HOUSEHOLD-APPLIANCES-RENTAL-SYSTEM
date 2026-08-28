import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Environment } from '@react-three/drei';

function DraggableObject({ position, color, type, isSelected, onClick }) {
  return (
    <TransformControls mode="translate" showX showZ showY={false} enabled={isSelected}>
      <mesh position={position} onClick={onClick} castShadow receiveShadow>
        {type === 'fridge' && <boxGeometry args={[1, 2, 1]} />}
        {type === 'washer' && <boxGeometry args={[1, 1, 1]} />}
        {type === 'sofa' && <boxGeometry args={[2.5, 0.8, 1]} />}
        <meshStandardMaterial color={isSelected ? '#ffaa00' : color} />
      </mesh>
    </TransformControls>
  );
}

export default function RoomConfigurator() {
  const [objects, setObjects] = useState([
    { id: 1, type: 'fridge', position: [-2, 1, -2], color: '#cccccc' },
    { id: 2, type: 'washer', position: [2, 0.5, -2], color: '#dddddd' },
    { id: 3, type: 'sofa', position: [0, 0.4, 2], color: '#334455' },
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const handleCanvasClick = (e) => {
    // If we click on the background/grid, deselect
    if (e.object.name === 'grid') {
      setSelectedId(null);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: '#111', color: '#fff', zIndex: 10 }}>
        <h2>3D Room Configurator</h2>
        <p>Drag the objects to arrange your room. (Click to select/deselect)</p>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Environment preset="city" />

          {/* Floor Grid */}
          <mesh name="grid" rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow onClick={handleCanvasClick}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          <Grid infiniteGrid fadeDistance={20} sectionColor="#aaaaaa" cellColor="#dddddd" />

          {/* Objects */}
          {objects.map((obj) => (
            <DraggableObject
              key={obj.id}
              position={obj.position}
              color={obj.color}
              type={obj.type}
              isSelected={selectedId === obj.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(obj.id);
              }}
            />
          ))}

          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} />
        </Canvas>
      </div>
    </div>
  );
}
