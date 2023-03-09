import { useRef } from 'react';
import { Group } from 'three';
import { PieceColor, PieceType } from '../../models/types';
import { getPieceModel } from './PieceModels';

interface BasePieceProps {
  type: PieceType;
  color: PieceColor;
  position: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
}

export const BasePiece = ({ type, color, position, onClick, isSelected }: BasePieceProps) => {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {getPieceModel(type, color, isSelected)}
    </group>
  );
}; 