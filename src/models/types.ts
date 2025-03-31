import { DifficultyLevel } from '../services/aiService';

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

export type GameMode = 'single' | 'multiplayer-room' | 'multiplayer-local' | null;

export interface Room {
  code: string;
  players: {
    white?: string;
    black?: string;
  };
  gameState: GameState;
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
  gameMode: GameMode;
  playerColor: PieceColor | null;
  roomCode?: string;
  aiMode: boolean;
  aiDifficulty: DifficultyLevel;
  aiColor: PieceColor | null;
} 