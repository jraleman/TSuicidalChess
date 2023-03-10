import { useRef, useState, useEffect } from 'react';
import { Group } from 'three';
import { BasePiece } from './BasePiece';
import { useGameStore } from '../../context/gameStore';
import { ChessPiece, Position } from '../../models/types';

const getInitialPosition = (piece: ChessPiece): Position => {
  return { x: piece.position.x, y: piece.position.y };
};

export const ChessPieces = () => {
  const groupRef = useRef<Group>(null);
  const { board, selectedPiece, selectPiece } = useGameStore();
  const [movingPiece, setMovingPiece] = useState<{
    piece: ChessPiece;
    to: Position;
  } | null>(null);
  const [capturedPiece, setCapturedPiece] = useState<ChessPiece | null>(null);

  useEffect(() => {
    const handlePieceMove = (event: CustomEvent) => {
      const { piece, to } = event.detail;
      setMovingPiece({ piece, to });
    };

    const handlePieceCapture = (event: CustomEvent) => {
      const { piece } = event.detail;
      setCapturedPiece(piece);
    };

    window.addEventListener('pieceMove', handlePieceMove as EventListener);
    window.addEventListener('pieceCapture', handlePieceCapture as EventListener);

    return () => {
      window.removeEventListener('pieceMove', handlePieceMove as EventListener);
      window.removeEventListener('pieceCapture', handlePieceCapture as EventListener);
    };
  }, []);

  const handlePieceClick = (piece: ChessPiece) => {
    selectPiece(piece);
  };

  return (
    <group ref={groupRef}>
      {board.flat().map((piece) => {
        if (!piece) return null;

        const position = getInitialPosition(piece);
        const isSelected = selectedPiece?.id === piece.id;
        const isMoving = movingPiece?.piece.id === piece.id;
        const moveTo = isMoving ? movingPiece.to : undefined;
        const isCaptured = capturedPiece?.id === piece.id;

        return (
          <BasePiece
            key={piece.id}
            type={piece.type}
            color={piece.color}
            position={position}
            onClick={() => handlePieceClick(piece)}
            isSelected={isSelected}
            isMoving={isMoving}
            moveTo={moveTo}
            isCaptured={isCaptured}
          />
        );
      })}
    </group>
  );
}; 