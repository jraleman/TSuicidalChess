import { GameEngine } from './gameEngine';
import { Position, Piece } from './types';

class ChessUI {
    private engine: GameEngine;
    private board: HTMLElement;
    private currentTurnElement: HTMLElement;
    private whiteCapturedElement: HTMLElement;
    private blackCapturedElement: HTMLElement;
    private squares: HTMLElement[][] = [];

    constructor() {
        this.engine = new GameEngine();
        this.board = document.getElementById('chessboard') as HTMLElement;
        this.currentTurnElement = document.getElementById('current-turn') as HTMLElement;
        this.whiteCapturedElement = document.getElementById('white-captured') as HTMLElement;
        this.blackCapturedElement = document.getElementById('black-captured') as HTMLElement;

        this.initializeBoard();
        this.setupEventListeners();
        this.render();
    }

    private initializeBoard(): void {
        // Clear existing board
        this.board.innerHTML = '';
        this.squares = [];

        // Create squares
        for (let row = 0; row < 8; row++) {
            this.squares[row] = [];
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row.toString();
                square.dataset.col = col.toString();
                this.squares[row][col] = square;
                this.board.appendChild(square);
            }
        }
    }

    private setupEventListeners(): void {
        // Square click handler
        this.board.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const square = target.closest('.square') as HTMLElement;
            if (!square) return;

            const row = parseInt(square.dataset.row || '0');
            const col = parseInt(square.dataset.col || '0');
            this.handleSquareClick({ row, col });
        });

        // New game button
        const newGameBtn = document.getElementById('new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.engine = new GameEngine();
                this.render();
            });
        }

        // Undo move button
        const undoMoveBtn = document.getElementById('undo-move');
        if (undoMoveBtn) {
            undoMoveBtn.addEventListener('click', () => {
                if (this.engine.undoMove()) {
                    this.render();
                }
            });
        }
    }

    private handleSquareClick(position: Position): void {
        const state = this.engine.getState();
        const clickedPiece = state.board[position.row][position.col];

        // If a piece is already selected
        if (state.selectedPiece) {
            // Try to make a move
            if (this.engine.makeMove(position)) {
                this.render();
                return;
            }
            // If move failed, try to select new piece
            this.engine.selectPiece(position);
            this.render();
            return;
        }

        // If no piece is selected, try to select one
        if (clickedPiece && clickedPiece.color === state.currentTurn) {
            this.engine.selectPiece(position);
            this.render();
        }
    }

    private render(): void {
        const state = this.engine.getState();

        // Update turn indicator
        this.currentTurnElement.textContent = state.currentTurn;

        // Update captured pieces
        this.whiteCapturedElement.textContent = this.getPiecesText(state.capturedPieces.white);
        this.blackCapturedElement.textContent = this.getPiecesText(state.capturedPieces.black);

        // Clear all squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = this.squares[row][col];
                square.innerHTML = '';
                square.classList.remove('selected', 'valid-move');
            }
        }

        // Render pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = state.board[row][col];
                if (piece) {
                    this.renderPiece(piece, this.squares[row][col]);
                }
            }
        }

        // Highlight selected piece and valid moves
        if (state.selectedPiece) {
            const { row, col } = state.selectedPiece.position;
            this.squares[row][col].classList.add('selected');

            // Highlight valid moves
            for (const move of state.validMoves) {
                this.squares[move.row][move.col].classList.add('valid-move');
            }
        }
    }

    private renderPiece(piece: Piece, square: HTMLElement): void {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.innerHTML = this.getPieceSymbol(piece);
        square.appendChild(pieceElement);
    }

    private getPieceSymbol(piece: Piece): string {
        const symbols = {
            white: {
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black: {
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟'
            }
        };
        return symbols[piece.color][piece.type];
    }

    private getPiecesText(pieces: Piece[]): string {
        return pieces.map(piece => this.getPieceSymbol(piece)).join(' ');
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChessUI();
});