import { create } from 'zustand';
import { GameState, PieceColor, Position, ChessPiece } from '../models/types';

interface GameStore extends GameState {
  initializeGame: () => void;
  selectPiece: (piece: ChessPiece) => void;
  movePiece: (from: Position, to: Position) => void;
  calculatePossibleMoves: (piece: ChessPiece) => Position[];
  updateScore: (color: PieceColor, points: number) => void;
}

const createPiece = (type: ChessPiece['type'], color: PieceColor, position: Position): ChessPiece => ({
  id: `${type}-${color}-${position.x}-${position.y}`,
  type,
  color,
  position,
  hasMoved: false,
});

const createInitialBoard = (): (ChessPiece | null)[][] => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = createPiece('pawn', 'white', { x: i, y: 1 });
    board[6][i] = createPiece('pawn', 'black', { x: i, y: 6 });
  }

  // Initialize other pieces
  const backRankPieces: ChessPiece['type'][] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let i = 0; i < 8; i++) {
    board[0][i] = createPiece(backRankPieces[i], 'white', { x: i, y: 0 });
    board[7][i] = createPiece(backRankPieces[i], 'black', { x: i, y: 7 });
  }

  return board;
};

const createInitialState = (): GameState => ({
  board: createInitialBoard(),
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