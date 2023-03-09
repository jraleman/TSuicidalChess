import { create } from 'zustand';
import { GameState, PieceColor, Position, ChessPiece } from '../models/types';
import { getValidMoves, hasForcedCapture } from '../utils/movementValidation';

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
    const { board, currentTurn } = get();
    
    // Only allow selecting pieces of the current turn
    if (piece.color !== currentTurn) return;

    // Check if there are forced captures
    const hasForced = hasForcedCapture(board, currentTurn);
    const moves = getValidMoves(piece, board);
    
    // If there are forced captures, only allow capture moves
    const validMoves = hasForced
      ? moves.filter(move => board[move.y][move.x] !== null)
      : moves;

    set({ selectedPiece: piece, possibleMoves: validMoves });
  },

  movePiece: (from: Position, to: Position) => {
    const { board, selectedPiece, currentTurn, scores } = get();
    
    if (!selectedPiece) return;

    // Check if the move is valid
    const validMoves = getValidMoves(selectedPiece, board);
    if (!validMoves.some(move => move.x === to.x && move.y === to.y)) return;

    // Check if there are forced captures
    const hasForced = hasForcedCapture(board, currentTurn);
    const targetPiece = board[to.y][to.x];
    
    // If there are forced captures, only allow capture moves
    if (hasForced && !targetPiece) return;

    // Create new board state
    const newBoard = board.map(row => [...row]);
    newBoard[from.y][from.x] = null;
    
    // Update piece position and hasMoved status
    const movedPiece = {
      ...selectedPiece,
      position: to,
      hasMoved: true,
    };
    newBoard[to.y][to.x] = movedPiece;

    // Update score if a piece was captured
    if (targetPiece) {
      const newScores = {
        ...scores,
        [targetPiece.color]: scores[targetPiece.color] + 1,
      };
      set({ scores: newScores });
    }

    // Check for game over (all pieces captured)
    const whitePieces = newBoard.flat().filter(p => p?.color === 'white').length;
    const blackPieces = newBoard.flat().filter(p => p?.color === 'black').length;

    set({
      board: newBoard,
      selectedPiece: null,
      possibleMoves: [],
      currentTurn: currentTurn === 'white' ? 'black' : 'white',
      gameOver: whitePieces === 0 || blackPieces === 0,
      winner: whitePieces === 0 ? 'black' : blackPieces === 0 ? 'white' : null,
    });
  },

  calculatePossibleMoves: (piece: ChessPiece): Position[] => {
    const { board } = get();
    return getValidMoves(piece, board);
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