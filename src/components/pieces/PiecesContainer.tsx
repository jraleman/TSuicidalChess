import { useRef } from 'react';
import { Group } from 'three';
import { ChessPiece } from './ChessPiece';
import { useGameStore } from '../../context/gameStore';

export const PiecesContainer = () => {
  const groupRef = useRef<Group>(null);
  const { board, selectedPiece, selectPiece } = useGameStore();

  const handlePieceClick = (piece: any) => {
    if (piece) {
      selectPiece(piece);
    }
  };

  return (
    <group ref={groupRef}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          if (!piece) return null;

          return (
            <ChessPiece
              key={`${piece.id}`}
              type={piece.type}
              color={piece.color}
              position={{ x: colIndex, y: rowIndex }}
              onClick={() => handlePieceClick(piece)}
              isSelected={selectedPiece?.id === piece.id}
            />
          );
        })
      )}
    </group>
  );
}; 