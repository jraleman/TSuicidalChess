import { useEffect } from 'react';
import { PieceColor, PieceType, Position } from '../../models/types';
import { getPieceModel } from './PieceModels';
import { usePieceAnimation } from '../../hooks/usePieceAnimation';

interface BasePieceProps {
  type: PieceType;
  color: PieceColor;
  position: Position;
  onClick?: () => void;
  isSelected?: boolean;
  isMoving?: boolean;
  moveTo?: Position;
  isCaptured?: boolean;
}

export const BasePiece = ({ 
  type, 
  color, 
  position, 
  onClick, 
  isSelected,
  isMoving,
  moveTo,
  isCaptured
}: BasePieceProps) => {
  const { groupRef, startAnimation, isAnimating } = usePieceAnimation();

  useEffect(() => {
    if (isMoving && moveTo) {
      startAnimation(position, moveTo);
    }
  }, [isMoving, moveTo, position, startAnimation]);

  useEffect(() => {
    if (isCaptured) {
      // Animate capture by moving piece up and fading out
      startAnimation(position, { x: position.x, y: position.y + 1 }, true);
    }
  }, [isCaptured, position, startAnimation]);

  if (isCaptured && !isAnimating) {
    return null;
  }

  return (
    <group 
      ref={groupRef} 
      onClick={onClick}
      position={[position.x - 3.5, 0.2, position.y - 3.5]}
    >
      {getPieceModel(type, color, isSelected)}
    </group>
  );
}; 