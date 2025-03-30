import { create } from 'zustand';
import { GameState, PieceColor, Position, ChessPiece, GameMode } from '../models/types';
import { getValidMoves, hasForcedCapture } from '../utils/movementValidation';
import { roomService } from '../services/roomService';
import { aiService, DifficultyLevel } from '../services/aiService';
import { soundManager } from '../utils/soundManager';

interface GameStore extends GameState {
  initializeGame: () => void;
  selectPiece: (piece: ChessPiece) => void;
  movePiece: (from: Position, to: Position) => void;
  calculatePossibleMoves: (piece: ChessPiece) => Position[];
  updateScore: (color: PieceColor, points: number) => void;
  setCurrentTurn: (turn: PieceColor) => void;
  setGameOver: (isOver: boolean) => void;
  setSelectedPiece: (piece: ChessPiece | null) => void;
  setPossibleMoves: (moves: Position[]) => void;
  switchTurn: () => void;
  setGameMode: (mode: GameMode) => void;
  setPlayerColor: (color: PieceColor) => void;
  setRoomCode: (code: string) => void;
  setAIMode: (enabled: boolean) => void;
  setAIDifficulty: (difficulty: DifficultyLevel) => void;
  makeAIMove: () => void;
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
  gameMode: null,
  playerColor: null,
  roomCode: undefined,
  aiMode: true,
  aiDifficulty: 'medium',
  aiColor: null,
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  initializeGame: () => {
    set(createInitialState());
  },

  selectPiece: (piece: ChessPiece) => {
    const { board, currentTurn, gameMode, playerColor, aiMode } = get();
    
    // In multiplayer mode, only allow selecting pieces of the player's color
    if (gameMode === 'multiplayer' && piece.color !== playerColor) return;
    
    // In AI mode, only allow selecting pieces of the current turn
    if (aiMode && piece.color !== currentTurn) return;

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
    const { board, selectedPiece, currentTurn, scores, roomCode, gameMode, playerColor, aiMode, aiDifficulty, aiColor } = get();
    
    if (!selectedPiece) return;

    // Check if the move is valid
    const validMoves = getValidMoves(selectedPiece, board);
    if (!validMoves.some(move => move.x === to.x && move.y === to.y)) return;

    // Create new board with the move
    const newBoard = board.map(row => [...row]);
    newBoard[to.y][to.x] = newBoard[from.y][from.x];
    newBoard[from.y][from.x] = null;

    // Update piece position
    if (newBoard[to.y][to.x]) {
      newBoard[to.y][to.x] = {
        ...newBoard[to.y][to.x]!,
        position: to,
        hasMoved: true
      };
    }

    // Update scores if a piece was captured
    const newScores = { ...scores };
    if (board[to.y][to.x]) {
      newScores[currentTurn === 'white' ? 'black' : 'white'] += 1;
    }

    // Check for game over (all pieces captured)
    const whitePieces = newBoard.flat().filter(p => p?.color === 'white').length;
    const blackPieces = newBoard.flat().filter(p => p?.color === 'black').length;

    const newState: GameState = {
      board: newBoard,
      selectedPiece: null,
      possibleMoves: [],
      scores: newScores,
      currentTurn: currentTurn === 'white' ? 'black' : 'white',
      gameOver: whitePieces === 0 || blackPieces === 0,
      winner: whitePieces === 0 ? 'white' : blackPieces === 0 ? 'black' : null,
      gameMode,
      playerColor,
      roomCode,
      aiMode,
      aiDifficulty,
      aiColor
    };

    set(newState);

    // Update room state if in multiplayer mode
    if (roomCode) {
      roomService.updateRoomState(roomCode, newState);
    }
  },

  calculatePossibleMoves: (piece: ChessPiece) => {
    const { board } = get();
    return getValidMoves(piece, board);
  },

  updateScore: (color: PieceColor, points: number) => {
    const { scores } = get();
    set({
      scores: {
        ...scores,
        [color]: scores[color] + points
      }
    });
  },

  setCurrentTurn: (turn: PieceColor) => set({ currentTurn: turn }),
  setGameOver: (isOver: boolean) => set({ gameOver: isOver }),
  setSelectedPiece: (piece: ChessPiece | null) => set({ selectedPiece: piece }),
  setPossibleMoves: (moves: Position[]) => set({ possibleMoves: moves }),
  switchTurn: () => set((state) => ({
    currentTurn: state.currentTurn === 'white' ? 'black' : 'white'
  })),
  setGameMode: (mode: GameMode) => set({ gameMode: mode }),
  setPlayerColor: (color: PieceColor) => set({ 
    playerColor: color,
    aiColor: color === 'white' ? 'black' : 'white',
    currentTurn: 'white'
  }),
  setRoomCode: (code: string) => set({ roomCode: code }),
  setAIMode: (enabled: boolean) => {
    set({ aiMode: enabled });
  },
  setAIDifficulty: (difficulty: DifficultyLevel) => {
    set({ aiDifficulty: difficulty });
  },
  makeAIMove: () => {
    const { board, currentTurn, aiMode, aiDifficulty, aiColor } = get();
    
    if (!aiMode || !aiColor || currentTurn !== aiColor) return;

    const bestMove = aiService.getBestMove(board, aiColor, aiDifficulty);
    if (!bestMove) return;

    // Check if there's a piece to capture
    const targetPiece = board[bestMove.to.y][bestMove.to.x];
    
    // Trigger piece movement animation
    const event = new CustomEvent('pieceMove', {
      detail: { piece: bestMove.piece, to: bestMove.to }
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
      // Create new board with the move
      const newBoard = board.map(row => [...row]);
      newBoard[bestMove.to.y][bestMove.to.x] = bestMove.piece;
      newBoard[bestMove.piece.position.y][bestMove.piece.position.x] = null;

      // Update piece position
      if (newBoard[bestMove.to.y][bestMove.to.x]) {
        newBoard[bestMove.to.y][bestMove.to.x] = {
          ...newBoard[bestMove.to.y][bestMove.to.x]!,
          position: bestMove.to,
          hasMoved: true
        };
      }

      // Update scores if a piece was captured
      const { scores } = get();
      const newScores = { ...scores };
      if (board[bestMove.to.y][bestMove.to.x]) {
        newScores[currentTurn === 'white' ? 'black' : 'white'] += 1;
      }

      // Check for game over (all pieces captured)
      const whitePieces = newBoard.flat().filter(p => p?.color === 'white').length;
      const blackPieces = newBoard.flat().filter(p => p?.color === 'black').length;

      const newState: GameState = {
        board: newBoard,
        selectedPiece: null,
        possibleMoves: [],
        scores: newScores,
        currentTurn: currentTurn === 'white' ? 'black' : 'white',
        gameOver: whitePieces === 0 || blackPieces === 0,
        winner: whitePieces === 0 ? 'white' : blackPieces === 0 ? 'black' : null,
        gameMode: get().gameMode,
        playerColor: get().playerColor,
        roomCode: get().roomCode,
        aiMode: get().aiMode,
        aiDifficulty: get().aiDifficulty,
        aiColor: get().aiColor,
      };

      set(newState);
    }, 500); // Match this with animation duration
  },
})); 