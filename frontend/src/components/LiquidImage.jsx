import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uHoverState;
uniform float uTime;
varying vec2 vUv;

// Classic Perlin 2D Noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float noise = snoise(uv * 5.0 + uTime * 0.5);
  
  // Ripple effect on hover
  uv.x += noise * 0.05 * uHoverState;
  uv.y += noise * 0.05 * uHoverState;
  
  vec4 color = texture2D(uTexture, uv);
  gl_FragColor = color;
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // We want the plane to completely fill the viewport.
  // We can just use the uv coordinates to map to clip space [-1, 1].
  gl_Position = vec4((uv.x - 0.5) * 2.0, (uv.y - 0.5) * 2.0, 0.0, 1.0);
}
`;

const ShaderPlane = ({ imageSrc, isHovered }) => {
  const meshRef = useRef();
  const texture = useTexture(imageSrc);
  
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uHoverState: { value: 0.0 },
    uTime: { value: 0.0 }
  }), [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.uHoverState.value = THREE.MathUtils.lerp(
        meshRef.current.material.uniforms.uHoverState.value,
        isHovered ? 1.0 : 0.0,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default function LiquidImage({ src, alt, className }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={className} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
    >
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          position: 'absolute',
          top: 0, left: 0,
          opacity: isHovered ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }} 
      />
      {isHovered && (
        <React.Suspense fallback={null}>
          <Canvas style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <ShaderPlane imageSrc={src} isHovered={isHovered} />
          </Canvas>
        </React.Suspense>
      )}
    </div>
  );
}
