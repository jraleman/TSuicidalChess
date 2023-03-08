import { create } from 'zustand';
import { GameState, PieceColor, Position, ChessPiece } from '../models/types';

interface GameStore extends GameState {
  initializeGame: () => void;
  selectPiece: (piece: ChessPiece) => void;
  movePiece: (from: Position, to: Position) => void;
  calculatePossibleMoves: (piece: ChessPiece) => Position[];
  updateScore: (color: PieceColor, points: number) => void;
}

const createInitialState = (): GameState => ({
  board: Array(8).fill(null).map(() => Array(8).fill(null)),
  currentTurn: 'white',
  selectedPiece: null,
  possibleMoves: [],
  scores: {
    white: 0,
    black: 0,
  },
  gameOver: false,
  winner: null,
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  initializeGame: () => {
    set(createInitialState());
  },

  selectPiece: (piece: ChessPiece) => {
    const possibleMoves = get().calculatePossibleMoves(piece);
    set({ selectedPiece: piece, possibleMoves });
  },

  movePiece: (from: Position, to: Position) => {
    // Implementation will be added later
  },

  calculatePossibleMoves: (piece: ChessPiece): Position[] => {
    // Implementation will be added later
    return [];
  },

  updateScore: (color: PieceColor, points: number) => {
    set((state) => ({
      scores: {
        ...state.scores,
        [color]: state.scores[color] + points,
      },
    }));
  },
})); 