import { useRef } from 'react';
import { Group } from 'three';
import { ChessSquare } from './ChessSquare';
import { useGameStore } from '../../context/gameStore';
import { Position } from '../../models/types';
import { soundManager } from '../../utils/soundManager';

export const ChessBoard = () => {
  const boardRef = useRef<Group>(null);
  const { selectedPiece, possibleMoves, movePiece, board } = useGameStore();

  const handleSquareClick = (position: Position) => {
    if (!selectedPiece) return;

    // Check if the clicked position is a valid move
    const isValidMove = possibleMoves.some(
      move => move.x === position.x && move.y === position.y
    );

    if (isValidMove) {
      // Check if there's a piece to capture
      const targetPiece = board[position.y][position.x];
      
      // Trigger piece movement animation
      const event = new CustomEvent('pieceMove', {
        detail: { piece: selectedPiece, to: position }
      });
      window.dispatchEvent(event);

      // If there's a piece to capture, trigger capture animation and sound
      if (targetPiece) {
        const captureEvent = new CustomEvent('pieceCapture', {
          detail: { piece: targetPiece }
        });
        window.dispatchEvent(captureEvent);
        soundManager.playCaptureSound();
      }

      // Update game state after animations
      setTimeout(() => {
        movePiece(selectedPiece.position, position);
      }, 500); // Match this with animation duration
    }
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