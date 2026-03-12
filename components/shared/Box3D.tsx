'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

interface BoxProps {
  dimensions: { length: number; width: number; height: number };
  color?: string;
}

function CorrugatedBox({ dimensions, color = '#A67B5B' }: BoxProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  // Normalize dimensions for viewing (scale largest side to ~3 units)
  const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
  const scale = 3 / maxDim;
  const w = dimensions.length * scale;
  const h = dimensions.height * scale;
  const d = dimensions.width * scale;

  // Create a custom material with slight "corrugated" texture simulation
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.8,
    metalness: 0.1,
    bumpScale: 0.02,
  }), [color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.2;
  });

  return (
    <group>
      {/* Main Box Body */}
      <mesh ref={mesh} castShadow receiveShadow material={material}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Flap details (simplified representation for performance) */}
      <mesh position={[0, h/2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.98, d * 0.98]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      
      {/* Tape strip simulation */}
      <mesh position={[0, h/2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.1, d * 0.99]} />
        <meshStandardMaterial color="#8D6E63" opacity={0.6} transparent roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function Box3D({ dimensions = { length: 300, width: 200, height: 200 } }) {
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 400 }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={40} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <CorrugatedBox dimensions={dimensions} />
        </Float>

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        <Environment preset="city" />
      </Canvas>
    </Box>
  );
}

import { Box } from '@mui/material';
