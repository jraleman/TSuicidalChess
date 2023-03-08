import { useRef } from 'react';
import { Mesh } from 'three';
import { Position } from '../../models/types';

interface ChessSquareProps {
  position: Position;
  isLight: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isPossibleMove?: boolean;
}

export const ChessSquare = ({ position, isLight, onClick, isSelected, isPossibleMove }: ChessSquareProps) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={[position.x, 0, position.y]}
      onClick={onClick}
      receiveShadow
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial
        color={isSelected ? '#4ade80' : isPossibleMove ? '#22c55e' : isLight ? '#f0d9b5' : '#b58863'}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}; 