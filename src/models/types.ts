export type PieceColor = 'white' | 'black';
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface Position {
  x: number;
  y: number;
}

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: Position;
  hasMoved: boolean;
}

export interface GameState {
  board: (ChessPiece | null)[][];
  currentTurn: PieceColor;
  selectedPiece: ChessPiece | null;
  possibleMoves: Position[];
  scores: {
    white: number;
    black: number;
  };
  gameOver: boolean;
  winner: PieceColor | null;
} 