import { Piece, Position, PieceColor, PieceType, Move, GameState } from './types';

export class GameEngine {
    private state: GameState;

    constructor() {
        this.state = this.initializeGame();
    }

    private initializeGame(): GameState {
        const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Initialize pawns
        for (let col = 0; col < 8; col++) {
            board[1][col] = { type: 'pawn', color: 'black', position: { row: 1, col } };
            board[6][col] = { type: 'pawn', color: 'white', position: { row: 6, col } };
        }

        // Initialize other pieces
        const backRowPieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let col = 0; col < 8; col++) {
            board[0][col] = { type: backRowPieces[col], color: 'black', position: { row: 0, col } };
            board[7][col] = { type: backRowPieces[col], color: 'white', position: { row: 7, col } };
        }

        return {
            board,
            currentTurn: 'white',
            capturedPieces: { white: [], black: [] },
            moveHistory: [],
            selectedPiece: null,
            validMoves: []
        };
    }

    public getState(): GameState {
        return { ...this.state };
    }

    public selectPiece(position: Position): void {
        const piece = this.state.board[position.row][position.col];
        if (!piece || piece.color !== this.state.currentTurn) {
            this.state.selectedPiece = null;
            this.state.validMoves = [];
            return;
        }

        this.state.selectedPiece = { ...piece };
        this.state.validMoves = this.getValidMoves(piece);
    }

    public makeMove(to: Position): boolean {
        if (!this.state.selectedPiece || !this.isValidMove(to)) {
            return false;
        }

        const from = this.state.selectedPiece.position;
        const capturedPiece = this.state.board[to.row][to.col];
        const move: Move = {
            from,
            to,
            piece: this.state.selectedPiece,
            capturedPiece: capturedPiece || undefined
        };

        // Execute move
        this.state.board[to.row][to.col] = {
            ...this.state.selectedPiece,
            position: to,
            hasMoved: true
        };
        this.state.board[from.row][from.col] = null;

        // Handle capture
        if (capturedPiece) {
            this.state.capturedPieces[capturedPiece.color].push(capturedPiece);
        }

        this.state.moveHistory.push(move);
        this.state.currentTurn = this.state.currentTurn === 'white' ? 'black' : 'white';
        this.state.selectedPiece = null;
        this.state.validMoves = [];

        return true;
    }

    public undoMove(): boolean {
        const lastMove = this.state.moveHistory.pop();
        if (!lastMove) return false;

        // Restore pieces to their original positions
        this.state.board[lastMove.from.row][lastMove.from.col] = {
            ...lastMove.piece,
            position: lastMove.from
        };
        this.state.board[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece || null;

        // Remove captured piece from captured list if there was one
        if (lastMove.capturedPiece) {
            const capturedList = this.state.capturedPieces[lastMove.capturedPiece.color];
            capturedList.pop();
        }

        this.state.currentTurn = this.state.currentTurn === 'white' ? 'black' : 'white';
        return true;
    }

    private isValidMove(to: Position): boolean {
        return this.state.validMoves.some(move => move.row === to.row && move.col === to.col);
    }

    private getValidMoves(piece: Piece): Position[] {
        const moves: Position[] = [];
        const capturingMoves: Position[] = [];

        switch (piece.type) {
            case 'pawn':
                this.getPawnMoves(piece, moves, capturingMoves);
                break;
            case 'knight':
                this.getKnightMoves(piece, moves, capturingMoves);
                break;
            case 'bishop':
                this.getBishopMoves(piece, moves, capturingMoves);
                break;
            case 'rook':
                this.getRookMoves(piece, moves, capturingMoves);
                break;
            case 'queen':
                this.getQueenMoves(piece, moves, capturingMoves);
                break;
            case 'king':
                this.getKingMoves(piece, moves, capturingMoves);
                break;
        }

        // In anti-chess, if a capture is possible, it must be made
        return capturingMoves.length > 0 ? capturingMoves : moves;
    }

    private getPawnMoves(piece: Piece, moves: Position[], capturingMoves: Position[]): void {
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;

        // Forward moves
        if (!this.isCapturePossible(piece)) {
            const oneStep = { row: piece.position.row + direction, col: piece.position.col };
            if (this.isInBounds(oneStep) && !this.state.board[oneStep.row][oneStep.col]) {
                moves.push(oneStep);

                // Two steps from starting position
                if (piece.position.row === startRow) {
                    const twoStep = { row: piece.position.row + 2 * direction, col: piece.position.col };
                    if (!this.state.board[twoStep.row][twoStep.col]) {
                        moves.push(twoStep);
                    }
                }
            }
        }

        // Diagonal captures
        const diagonals = [
            { row: piece.position.row + direction, col: piece.position.col - 1 },
            { row: piece.position.row + direction, col: piece.position.col + 1 }
        ];

        for (const pos of diagonals) {
            if (this.isInBounds(pos)) {
                const targetPiece = this.state.board[pos.row][pos.col];
                if (targetPiece && targetPiece.color !== piece.color) {
                    capturingMoves.push(pos);
                }
            }
        }
    }

    private getKnightMoves(piece: Piece, moves: Position[], capturingMoves: Position[]): void {
        const knightOffsets: [number, number][] = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [rowOffset, colOffset] of knightOffsets) {
            const pos = {
                row: piece.position.row + rowOffset,
                col: piece.position.col + colOffset
            };

            if (this.isInBounds(pos)) {
                const targetPiece = this.state.board[pos.row][pos.col];
                if (!targetPiece) {
                    if (!this.isCapturePossible(piece)) moves.push(pos);
                } else if (targetPiece.color !== piece.color) {
                    capturingMoves.push(pos);
                }
            }
        }
    }

    private getBishopMoves(piece: Piece, moves: Position[], capturingMoves: Position[]): void {
        const directions: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        this.getSlidingMoves(piece, moves, capturingMoves, directions);
    }

    private getRookMoves(piece: Piece, moves: Position[], capturingMoves: Position[]): void {
        const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.getSlidingMoves(piece, moves, capturingMoves, directions);
    }

    private getQueenMoves(piece: Piece, moves: Position[], capturingMoves: Position[]): void {
        const directions: [number, number][] = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        this.getSlidingMoves(piece, moves, capturingMoves, directions);
    }

    private getKingMoves(piece: Piece, moves: Position[], capturingMoves: Position[]): void {
        const directions: [number, number][] = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [rowDir, colDir] of directions) {
            const pos = {
                row: piece.position.row + rowDir,
                col: piece.position.col + colDir
            };

            if (this.isInBounds(pos)) {
                const targetPiece = this.state.board[pos.row][pos.col];
                if (!targetPiece) {
                    if (!this.isCapturePossible(piece)) moves.push(pos);
                } else if (targetPiece.color !== piece.color) {
                    capturingMoves.push(pos);
                }
            }
        }
    }

    private getSlidingMoves(
        piece: Piece,
        moves: Position[],
        capturingMoves: Position[],
        directions: [number, number][]
    ): void {
        for (const [rowDir, colDir] of directions) {
            let currentPos = {
                row: piece.position.row + rowDir,
                col: piece.position.col + colDir
            };

            while (this.isInBounds(currentPos)) {
                const targetPiece = this.state.board[currentPos.row][currentPos.col];
                if (!targetPiece) {
                    if (!this.isCapturePossible(piece)) moves.push({ ...currentPos });
                } else {
                    if (targetPiece.color !== piece.color) {
                        capturingMoves.push({ ...currentPos });
                    }
                    break;
                }
                currentPos.row += rowDir;
                currentPos.col += colDir;
            }
        }
    }

    private isInBounds(position: Position): boolean {
        return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
    }

    private isCapturePossible(piece: Piece): boolean {
        // Check if any piece of the current color can capture
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const currentPiece = this.state.board[row][col];
                if (currentPiece?.color === piece.color) {
                    const moves: Position[] = [];
                    const captures: Position[] = [];
                    
                    switch (currentPiece.type) {
                        case 'pawn':
                            this.getPawnMoves(currentPiece, moves, captures);
                            break;
                        case 'knight':
                            this.getKnightMoves(currentPiece, moves, captures);
                            break;
                        case 'bishop':
                            this.getBishopMoves(currentPiece, moves, captures);
                            break;
                        case 'rook':
                            this.getRookMoves(currentPiece, moves, captures);
                            break;
                        case 'queen':
                            this.getQueenMoves(currentPiece, moves, captures);
                            break;
                        case 'king':
                            this.getKingMoves(currentPiece, moves, captures);
                            break;
                    }
                    
                    if (captures.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}