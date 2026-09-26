import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Custom ShaderMaterial
const FluidClothMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, // 0 = fully closed, 1 = fully open
    uMouse: new THREE.Vector2(0, 0),
    uColor: new THREE.Color('#020617'), // Dark slate / obsidian
    uLightPos: new THREE.Vector3(5, 5, 5),
    uResolution: new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth : 1920, typeof window !== 'undefined' ? window.innerHeight : 1080)
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uMouse;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    // Simplex noise (fBm)
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
      m = m*m ; m = m*m ;
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
      vUv = uv;
      vec3 pos = position;
      
      // 1. Base organic folds (fBm)
      float noise1 = snoise(vec2(pos.x * 1.5, pos.y * 1.5 + uTime * 0.2));
      float noise2 = snoise(vec2(pos.x * 3.0 - uTime * 0.4, pos.y * 3.0));
      
      // Create deep vertical creases
      float verticalCrease = sin(pos.x * 5.0) * cos(pos.y * 2.0);
      
      pos.z += (noise1 * 0.3 + noise2 * 0.1) * (1.0 - uProgress);
      pos.z += verticalCrease * 0.2 * (1.0 - uProgress);

      // 2. Interactive Mouse Ripple
      float dist = distance(vUv, uMouse);
      float mouseRipple = exp(-dist * 10.0) * sin(dist * 20.0 - uTime * 5.0) * 0.5;
      pos.z += mouseRipple * (1.0 - smoothstep(0.0, 0.5, uProgress)); // Fades out as curtain opens
      
      // 3. Peeling / Fluid bunching effect driven by uProgress
      // As progress increases, the top edges fold downwards and inwards
      float peelCurve = smoothstep(0.0, 1.0, uProgress);
      
      // Viscous drip sag based on progress
      float sag = sin(vUv.x * 3.1415) * uProgress * 2.0;
      pos.y -= peelCurve * 15.0 + sag; 
      
      // Bunching z-distortion
      float bunchNoise = snoise(vec2(pos.x * 5.0, uTime)) * uProgress;
      pos.z += bunchNoise * 1.5;
      pos.z -= peelCurve * 5.0 * (1.0 - vUv.y); // curls back

      // Recompute approximate normal
      vNormal = normalize(normalMatrix * normal);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform vec3 uLightPos;
    uniform float uProgress;
    uniform float uTime;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    // Noise for edge thresholding
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
      m = m*m ; m = m*m ;
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
      // 1. Alpha Thresholding for liquid tears
      // Use world Y position and noise to create irregular fluid edges
      float edgeNoise = snoise(vec2(vUv.x * 20.0, uTime * 0.5)) * 0.5;
      float alphaThreshold = uProgress * 2.0; // scales up as curtain opens
      
      // We fade from top to bottom
      float fluidEdge = (1.0 - vUv.y) + edgeNoise * 0.2;
      
      if (fluidEdge < uProgress * 1.5) {
          discard; // Rip away the fabric/liquid
      }
      
      // 2. Shading & Lighting (Wet Metallic Satin)
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      vec3 lightDir = normalize(uLightPos - vWorldPosition);
      
      float NdotL = max(dot(normal, lightDir), 0.0);
      float NdotV = max(dot(normal, viewDir), 0.0);
      
      // Diffuse
      vec3 baseColor = uColor * (NdotL * 0.5 + 0.5); // softer shadows
      
      // Specular (High gloss)
      vec3 halfVector = normalize(lightDir + viewDir);
      float NdotH = max(dot(normal, halfVector), 0.0);
      float specular = pow(NdotH, 128.0) * 2.0;
      
      // Fresnel (Satin / Liquid edge sheen)
      float fresnelTerm = pow(1.0 - NdotV, 3.0);
      vec3 fresnelColor = vec3(0.5, 0.7, 1.0) * fresnelTerm * 1.5;
      
      // Iridescence / Subsurface fake
      vec3 iridescence = vec3(1.0, 0.4, 0.6) * snoise(vec2(vUv.x * 10.0, vUv.y * 10.0)) * 0.2;
      
      vec3 finalColor = baseColor + vec3(specular) + fresnelColor + iridescence;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ FluidClothMaterial });

function FluidCurtainPlane({ isRevealed, onComplete }) {
  const materialRef = useRef();
  const { viewport } = useThree();
  
  // Track mouse coordinates for shader
  const mouseCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseCoords.current.x = e.clientX / window.innerWidth;
      mouseCoords.current.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      
      // Smoothly interpolate mouse position for the ripple
      materialRef.current.uMouse.lerp(
        new THREE.Vector2(mouseCoords.current.x, mouseCoords.current.y), 
        0.1
      );
    }
  });

  useEffect(() => {
    if (isRevealed && materialRef.current) {
      // Trigger GSAP animation for uProgress
      gsap.to(materialRef.current, {
        uProgress: 1.0,
        duration: 3.5,
        ease: "power3.inOut",
        onComplete: onComplete
      });
    }
  }, [isRevealed, onComplete]);

  return (
    <mesh>
      {/* High-res subdivision for fluid simulation */}
      <planeGeometry args={[viewport.width * 1.2, viewport.height * 1.2, 200, 200]} />
      <fluidClothMaterial ref={materialRef} side={THREE.DoubleSide} transparent />
    </mesh>
  );
}

export default function ClothReveal({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#020617' }}>
      
      {/* Underlying Page Content */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          zIndex: 10,
          opacity: isRevealed ? 1 : 0.05, // Slightly visible through the liquid curtain
          transform: isRevealed ? 'scale(1)' : 'scale(0.95)',
          filter: isRevealed ? 'blur(0px)' : 'blur(10px)',
          transition: 'opacity 3.5s ease-out, transform 3.5s ease-out, filter 3.5s ease-out',
          overflowY: isAnimationComplete ? 'auto' : 'hidden',
          pointerEvents: isAnimationComplete ? 'auto' : 'none'
        }}
      >
        {children}
      </div>

      {/* WebGL Canvas Overlay */}
      {!isAnimationComplete && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 50,
            pointerEvents: 'none' // Mouse events tracked via window listener
          }}
        >
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={Math.min(window.devicePixelRatio, 2)}
          >
            <FluidCurtainPlane 
              isRevealed={isRevealed} 
              onComplete={() => setIsAnimationComplete(true)} 
            />
          </Canvas>
        </div>
      )}

      {/* Reveal Interaction Button */}
      {!isRevealed && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            onClick={handleReveal}
            style={{
              padding: '1.25rem 3rem',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '99px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px solid rgba(255,255,255,0.8)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px solid rgba(255,255,255,0.3)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Reveal Collection
          </button>
        </div>
      )}
      
    </div>
  );
}
