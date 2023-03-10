import { useRef } from 'react';
import { Group } from 'three';
import { PieceColor, PieceType } from '../../models/types';

interface PieceModelProps {
  color: PieceColor;
  isSelected?: boolean;
}

const Pawn = ({ color, isSelected }: PieceModelProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

const Rook = ({ color, isSelected }: PieceModelProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

const Knight = ({ color, isSelected }: PieceModelProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0.1, 0.35, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Ear */}
      <mesh position={[0.2, 0.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.1, 0.2, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

const Bishop = ({ color, isSelected }: PieceModelProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.15, 0.4, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

const Queen = ({ color, isSelected }: PieceModelProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Crown Points */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 4) * 0.2,
            0.5,
            Math.sin((i * Math.PI) / 4) * 0.2,
          ]}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[0.05, 0.1, 32]} />
          <meshStandardMaterial
            color={color === 'white' ? '#ffffff' : '#000000'}
            metalness={0.5}
            roughness={0.5}
            emissive={isSelected ? '#4ade80' : undefined}
            emissiveIntensity={isSelected ? 0.5 : 0}
          />
        </mesh>
      ))}
    </group>
  );
};

const King = ({ color, isSelected }: PieceModelProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 32]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Crown */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
      {/* Cross */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ffffff' : '#000000'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#4ade80' : undefined}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

export const getPieceModel = (type: PieceType, color: PieceColor, isSelected?: boolean) => {
  switch (type) {
    case 'pawn':
      return <Pawn color={color} isSelected={isSelected} />;
    case 'rook':
      return <Rook color={color} isSelected={isSelected} />;
    case 'knight':
      return <Knight color={color} isSelected={isSelected} />;
    case 'bishop':
      return <Bishop color={color} isSelected={isSelected} />;
    case 'queen':
      return <Queen color={color} isSelected={isSelected} />;
    case 'king':
      return <King color={color} isSelected={isSelected} />;
    default:
      return <Pawn color={color} isSelected={isSelected} />;
  }
}; 