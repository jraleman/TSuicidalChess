import { ChessPiece, PieceColor, PieceType } from '../models/types';

const createPiece = (
  type: PieceType,
  color: PieceColor,
  position: { x: number; y: number }
): ChessPiece => ({
  id: `${color}-${type}-${position.x}-${position.y}`,
  type,
  color,
  position,
  hasMoved: false,
});

export const initializeBoard = (): (ChessPiece | null)[][] => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = createPiece('pawn', 'white', { x: i, y: 1 });
    board[6][i] = createPiece('pawn', 'black', { x: i, y: 6 });
  }

  // Initialize other pieces
  const backRankPieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let i = 0; i < 8; i++) {
    board[0][i] = createPiece(backRankPieces[i], 'white', { x: i, y: 0 });
    board[7][i] = createPiece(backRankPieces[i], 'black', { x: i, y: 7 });
  }

  return board;
}; 