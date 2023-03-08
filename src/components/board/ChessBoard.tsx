import { useRef } from 'react';
import { Group } from 'three';
import { ChessSquare } from './ChessSquare';
import { useGameStore } from '../../context/gameStore';
import { Position } from '../../models/types';

export const ChessBoard = () => {
  const boardRef = useRef<Group>(null);
  const { selectedPiece, possibleMoves, selectPiece } = useGameStore();

  const handleSquareClick = (position: Position) => {
    // Implementation will be added later
  };

  return (
    <group ref={boardRef} position={[-3.5, 0, -3.5]}>
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const position = { x: col, y: row };
          const isLight = (row + col) % 2 === 0;
          const isSelected = selectedPiece?.position.x === col && selectedPiece?.position.y === row;
          const isPossibleMove = possibleMoves.some(
            (move) => move.x === col && move.y === row
          );

          return (
            <ChessSquare
              key={`${row}-${col}`}
              position={position}
              isLight={isLight}
              onClick={() => handleSquareClick(position)}
              isSelected={isSelected}
              isPossibleMove={isPossibleMove}
            />
          );
        })
      )}
    </group>
  );
}; 