export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface Position {
    row: number;
    col: number;
}

export interface Piece {
    type: PieceType;
    color: PieceColor;
    position: Position;
    hasMoved?: boolean;
}

export interface Move {
    from: Position;
    to: Position;
    piece: Piece;
    capturedPiece?: Piece;
}

export interface GameState {
    board: (Piece | null)[][];
    currentTurn: PieceColor;
    capturedPieces: {
        white: Piece[];
        black: Piece[];
    };
    moveHistory: Move[];
    selectedPiece: Piece | null;
    validMoves: Position[];
}