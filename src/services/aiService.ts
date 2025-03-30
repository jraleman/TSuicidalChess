import { ChessPiece, Position, PieceColor } from '../models/types';
import { getValidMoves, hasForcedCapture } from '../utils/movementValidation';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface AIMove {
  piece: ChessPiece;
  to: Position;
}

// Evaluation function for anti-chess
// Higher score means better position for the AI
const evaluatePosition = (board: (ChessPiece | null)[][], aiColor: PieceColor): number => {
  let score = 0;
  
  // Count remaining pieces (fewer pieces is better in anti-chess)
  const aiPieces = board.flat().filter(p => p?.color === aiColor).length;
  const opponentPieces = board.flat().filter(p => p?.color !== aiColor).length;
  
  // Fewer pieces is better
  score += (opponentPieces - aiPieces) * 10;
  
  // Check for forced captures
  const hasForced = hasForcedCapture(board, aiColor);
  if (hasForced) {
    score -= 15; // Strongly penalize forced captures
  }
  
  // Penalize moves that create forced captures for the AI
  const hasForcedForOpponent = hasForcedCapture(board, aiColor === 'white' ? 'black' : 'white');
  if (hasForcedForOpponent) {
    score += 5; // Reward moves that create forced captures for the opponent
  }
  
  return score;
};

// Get all possible moves for a color
const getAllPossibleMoves = (board: (ChessPiece | null)[][], color: PieceColor): AIMove[] => {
  const moves: AIMove[] = [];
  const hasForced = hasForcedCapture(board, color);
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(piece, board);
        validMoves.forEach(move => {
          // If there are forced captures, only include capture moves
          if (hasForced) {
            if (board[move.y][move.x] !== null) {
              moves.push({ piece, to: move });
            }
          } else {
            moves.push({ piece, to: move });
          }
        });
      }
    }
  }
  
  return moves;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: (ChessPiece | null)[][],
  depth: number,
  isMaximizing: boolean,
  aiColor: PieceColor,
  alpha: number,
  beta: number
): number => {
  if (depth === 0) {
    return evaluatePosition(board, aiColor);
  }
  
  const moves = getAllPossibleMoves(board, isMaximizing ? aiColor : aiColor === 'white' ? 'black' : 'white');
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = board.map(row => [...row]);
      newBoard[move.to.y][move.to.x] = move.piece;
      newBoard[move.piece.position.y][move.piece.position.x] = null;
      
      const evaluation = minimax(newBoard, depth - 1, false, aiColor, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = board.map(row => [...row]);
      newBoard[move.to.y][move.to.x] = move.piece;
      newBoard[move.piece.position.y][move.piece.position.x] = null;
      
      const evaluation = minimax(newBoard, depth - 1, true, aiColor, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// Get the best move for the AI
const getBestMove = (board: (ChessPiece | null)[][], aiColor: PieceColor, difficulty: DifficultyLevel): AIMove | null => {
  const moves = getAllPossibleMoves(board, aiColor);
  if (moves.length === 0) return null;
  
  switch (difficulty) {
    case 'easy':
      // Random move
      return moves[Math.floor(Math.random() * moves.length)];
      
    case 'medium':
      // Minimax with depth 2
      let bestMove = moves[0];
      let bestEval = -Infinity;
      
      for (const move of moves) {
        const newBoard = board.map(row => [...row]);
        newBoard[move.to.y][move.to.x] = move.piece;
        newBoard[move.piece.position.y][move.piece.position.x] = null;
        
        const evaluation = minimax(newBoard, 2, false, aiColor, -Infinity, Infinity);
        if (evaluation > bestEval) {
          bestEval = evaluation;
          bestMove = move;
        }
      }
      
      return bestMove;
      
    case 'hard':
      // Minimax with depth 3
      let bestMoveHard = moves[0];
      let bestEvalHard = -Infinity;
      
      for (const move of moves) {
        const newBoard = board.map(row => [...row]);
        newBoard[move.to.y][move.to.x] = move.piece;
        newBoard[move.piece.position.y][move.piece.position.x] = null;
        
        const evaluation = minimax(newBoard, 3, false, aiColor, -Infinity, Infinity);
        if (evaluation > bestEvalHard) {
          bestEvalHard = evaluation;
          bestMoveHard = move;
        }
      }
      
      return bestMoveHard;
  }
};

export const aiService = {
  getBestMove,
  evaluatePosition
}; 