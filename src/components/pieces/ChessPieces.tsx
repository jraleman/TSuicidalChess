import { useRef } from 'react';
import { Group } from 'three';
import { BasePiece } from './BasePiece';
import { useGameStore } from '../../context/gameStore';
import { ChessPiece } from '../../models/types';

const getInitialPosition = (piece: ChessPiece): [number, number, number] => {
  return [piece.position.x - 3.5, 0.2, piece.position.y - 3.5];
};

export const ChessPieces = () => {
  const groupRef = useRef<Group>(null);
  const { board, selectedPiece, selectPiece } = useGameStore();

  const handlePieceClick = (piece: ChessPiece) => {
    selectPiece(piece);
  };

  return (
    <group ref={groupRef}>
      {board.flat().map((piece, index) => {
        if (!piece) return null;

        const row = Math.floor(index / 8);
        const col = index % 8;
        const position = getInitialPosition(piece);
        const isSelected = selectedPiece?.id === piece.id;

        return (
          <BasePiece
            key={piece.id}
            type={piece.type}
            color={piece.color}
            position={position}
            onClick={() => handlePieceClick(piece)}
            isSelected={isSelected}
          />
        );
      })}
    </group>
  );
}; 