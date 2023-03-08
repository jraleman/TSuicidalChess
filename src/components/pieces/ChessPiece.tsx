import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { PieceColor, PieceType } from '../../models/types';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  position: { x: number; y: number };
  onClick?: () => void;
  isSelected?: boolean;
}

export const ChessPiece = ({ type, color, position, onClick, isSelected }: ChessPieceProps) => {
  const groupRef = useRef<Group>(null);

  const getPieceGeometry = () => {
    switch (type) {
      case 'pawn':
        return (
          <>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.6, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
      case 'rook':
        return (
          <>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.4, 1, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
      case 'knight':
        return (
          <>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.4, 1, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
      case 'bishop':
        return (
          <>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
      case 'queen':
        return (
          <>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
      case 'king':
        return (
          <>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={[position.x, 0.5, position.y]}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      {getPieceGeometry()}
    </group>
  );
}; 