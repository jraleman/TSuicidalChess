import { ChessPiece, Position, PieceColor } from '../models/types';

const isWithinBoard = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
};

const getPawnMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const direction = piece.color === 'white' ? 1 : -1;
  const startRow = piece.color === 'white' ? 1 : 6;

  // Forward moves
  const forward1 = { x: piece.position.x, y: piece.position.y + direction };
  const forward2 = { x: piece.position.x, y: piece.position.y + 2 * direction };

  if (isWithinBoard(forward1) && !board[forward1.y][forward1.x]) {
    moves.push(forward1);
    if (!piece.hasMoved && isWithinBoard(forward2) && !board[forward2.y][forward2.x]) {
      moves.push(forward2);
    }
  }

  // Capture moves
  const captures = [
    { x: piece.position.x - 1, y: piece.position.y + direction },
    { x: piece.position.x + 1, y: piece.position.y + direction },
  ];

  captures.forEach(capture => {
    if (isWithinBoard(capture)) {
      const targetPiece = board[capture.y][capture.x];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(capture);
      }
    }
  });

  return moves;
};

const getRookMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 0 }, { x: -1, y: 0 }
  ];

  directions.forEach(dir => {
    let currentPos = { ...piece.position };
    while (true) {
      currentPos = { x: currentPos.x + dir.x, y: currentPos.y + dir.y };
      if (!isWithinBoard(currentPos)) break;

      const targetPiece = board[currentPos.y][currentPos.x];
      if (!targetPiece) {
        moves.push({ ...currentPos });
      } else if (targetPiece.color !== piece.color) {
        moves.push({ ...currentPos });
        break;
      } else {
        break;
      }
    }
  });

  return moves;
};

const getKnightMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const offsets = [
    { x: 2, y: 1 }, { x: 2, y: -1 },
    { x: -2, y: 1 }, { x: -2, y: -1 },
    { x: 1, y: 2 }, { x: 1, y: -2 },
    { x: -1, y: 2 }, { x: -1, y: -2 }
  ];

  offsets.forEach(offset => {
    const newPos = {
      x: piece.position.x + offset.x,
      y: piece.position.y + offset.y
    };

    if (isWithinBoard(newPos)) {
      const targetPiece = board[newPos.y][newPos.x];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  });

  return moves;
};

const getBishopMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { x: 1, y: 1 }, { x: 1, y: -1 },
    { x: -1, y: 1 }, { x: -1, y: -1 }
  ];

  directions.forEach(dir => {
    let currentPos = { ...piece.position };
    while (true) {
      currentPos = { x: currentPos.x + dir.x, y: currentPos.y + dir.y };
      if (!isWithinBoard(currentPos)) break;

      const targetPiece = board[currentPos.y][currentPos.x];
      if (!targetPiece) {
        moves.push({ ...currentPos });
      } else if (targetPiece.color !== piece.color) {
        moves.push({ ...currentPos });
        break;
      } else {
        break;
      }
    }
  });

  return moves;
};

const getQueenMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  return [...getRookMoves(piece, board), ...getBishopMoves(piece, board)];
};

const getKingMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 0 }, { x: -1, y: 0 },
    { x: 1, y: 1 }, { x: 1, y: -1 },
    { x: -1, y: 1 }, { x: -1, y: -1 }
  ];

  directions.forEach(dir => {
    const newPos = {
      x: piece.position.x + dir.x,
      y: piece.position.y + dir.y
    };

    if (isWithinBoard(newPos)) {
      const targetPiece = board[newPos.y][newPos.x];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  });

  return moves;
};

export const getValidMoves = (piece: ChessPiece, board: (ChessPiece | null)[][]): Position[] => {
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(piece, board);
    case 'rook':
      return getRookMoves(piece, board);
    case 'knight':
      return getKnightMoves(piece, board);
    case 'bishop':
      return getBishopMoves(piece, board);
    case 'queen':
      return getQueenMoves(piece, board);
    case 'king':
      return getKingMoves(piece, board);
    default:
      return [];
  }
};

export const hasForcedCapture = (board: (ChessPiece | null)[][], currentTurn: PieceColor): boolean => {
  // Check if any piece has a capture move available
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === currentTurn) {
        const moves = getValidMoves(piece, board);
        if (moves.some(move => board[move.y][move.x] !== null)) {
          return true;
        }
      }
    }
  }
  return false;
}; 