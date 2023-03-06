/**
 * Board class for Anti-Chess
 * 
 * Responsibilities:
 * - Represents the 8x8 chess board
 * - Manages the positioning of pieces
 * - Handles visual representation of the board
 * - Tracks valid moves and captures
 * - Implements Anti-Chess specific rules for move validation
 */

import * as PIXI from 'pixi.js';
import { Piece } from './Piece';
import { Square } from './Square';
import { PieceType, Color } from '@/utils/Types';
import { Constants } from '@/utils/Constants';
import { MoveValidator } from '@/utils/MoveValidator';
import { AssetLoader } from '@/utils/AssetLoader';

export class Board {
  private squares: Square[][];
  private pieces: Piece[];
  private container: PIXI.Container;
  private moveValidator: MoveValidator;
  private assetLoader: AssetLoader;
  
  constructor() {
    // Initialize the board container
    this.container = new PIXI.Container();
    
    // Initialize empty arrays for squares and pieces
    this.squares = [];
    this.pieces = [];
    
    // Initialize move validator (will be set properly in init())
    this.moveValidator = null as unknown as MoveValidator;
    this.assetLoader = AssetLoader.getInstance();
  }
  
  public async init(): Promise<void> {
    // Set up the board
    await this.createSquares();
    
    // Position the board
    this.container.position.set(0, 0);
    
    // Initialize the move validator with a reference to this board
    this.moveValidator = new MoveValidator(this);
  }
  
  private async createSquares(): Promise<void> {
    // Create 8x8 grid of squares
    for (let y = 0; y < Constants.BOARD_SIZE; y++) {
      const row: Square[] = [];
      
      for (let x = 0; x < Constants.BOARD_SIZE; x++) {
        // Alternate square colors
        const isLight = (x + y) % 2 === 0;
        const square = new Square(x, y, isLight);
        
        // Add square graphics to the board container
        this.container.addChild(square.getGraphics());
        
        row.push(square);
      }
      
      this.squares.push(row);
    }
  }
  
  public setupPieces(): void {
    // Create and position all pieces in starting positions
    this.createPieces();
  }
  
  private createPieces(): void {
    // Clear any existing pieces
    this.pieces.forEach(piece => {
      this.container.removeChild(piece.getSprite());
    });
    this.pieces = [];
    
    // Initialize pawns
    for (let x = 0; x < Constants.BOARD_SIZE; x++) {
      // White pawns
      const whitePawn = new Piece(PieceType.PAWN, Color.WHITE, x, 6);
      this.addPiece(whitePawn, x, 6);
      
      // Black pawns
      const blackPawn = new Piece(PieceType.PAWN, Color.BLACK, x, 1);
      this.addPiece(blackPawn, x, 1);
    }
    
    // Initialize rooks
    this.addPiece(new Piece(PieceType.ROOK, Color.WHITE, 0, 7), 0, 7);
    this.addPiece(new Piece(PieceType.ROOK, Color.WHITE, 7, 7), 7, 7);
    this.addPiece(new Piece(PieceType.ROOK, Color.BLACK, 0, 0), 0, 0);
    this.addPiece(new Piece(PieceType.ROOK, Color.BLACK, 7, 0), 7, 0);
    
    // Initialize knights
    this.addPiece(new Piece(PieceType.KNIGHT, Color.WHITE, 1, 7), 1, 7);
    this.addPiece(new Piece(PieceType.KNIGHT, Color.WHITE, 6, 7), 6, 7);
    this.addPiece(new Piece(PieceType.KNIGHT, Color.BLACK, 1, 0), 1, 0);
    this.addPiece(new Piece(PieceType.KNIGHT, Color.BLACK, 6, 0), 6, 0);
    
    // Initialize bishops
    this.addPiece(new Piece(PieceType.BISHOP, Color.WHITE, 2, 7), 2, 7);
    this.addPiece(new Piece(PieceType.BISHOP, Color.WHITE, 5, 7), 5, 7);
    this.addPiece(new Piece(PieceType.BISHOP, Color.BLACK, 2, 0), 2, 0);
    this.addPiece(new Piece(PieceType.BISHOP, Color.BLACK, 5, 0), 5, 0);
    
    // Initialize queens
    this.addPiece(new Piece(PieceType.QUEEN, Color.WHITE, 3, 7), 3, 7);
    this.addPiece(new Piece(PieceType.QUEEN, Color.BLACK, 3, 0), 3, 0);
    
    // Initialize kings
    this.addPiece(new Piece(PieceType.KING, Color.WHITE, 4, 7), 4, 7);
    this.addPiece(new Piece(PieceType.KING, Color.BLACK, 4, 0), 4, 0);
  }
  
  private addPiece(piece: Piece, x: number, y: number): void {
    // Add piece to the array
    this.pieces.push(piece);
    
    // Add sprite to the container
    this.container.addChild(piece.getSprite());
    
    // Set piece on the square
    this.getSquareAt(x, y).setPiece(piece);
  }
  
  public movePiece(fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Get source and destination squares
    const fromSquare = this.getSquareAt(fromX, fromY);
    const toSquare = this.getSquareAt(toX, toY);
    
    // Get the piece to move
    const piece = fromSquare.getPiece();
    if (!piece) {
      return false;
    }
    
    // Check if the move is valid
    if (!this.isValidMove(piece, toX, toY)) {
      return false;
    }
    
    // Check if there's a piece to capture
    const capturedPiece = toSquare.getPiece();
    if (capturedPiece) {
      // Remove the captured piece
      this.container.removeChild(capturedPiece.getSprite());
      this.pieces = this.pieces.filter(p => p !== capturedPiece);
    }
    
    // Update piece and square states
    fromSquare.setPiece(null);
    toSquare.setPiece(piece);
    piece.setPosition(toX, toY);
    
    return true;
  }
  
  public findLegalMoves(piece: Piece): Square[] {
    const legalSquares: Square[] = [];
    const pos = piece.getPosition();
    
    // Check all squares on the board
    for (let y = 0; y < Constants.BOARD_SIZE; y++) {
      for (let x = 0; x < Constants.BOARD_SIZE; x++) {
        // Skip the piece's current position
        if (x === pos.x && y === pos.y) {
          continue;
        }
        
        // Check if the move is valid
        if (this.isValidMove(piece, x, y)) {
          legalSquares.push(this.getSquareAt(x, y));
        }
      }
    }
    
    return legalSquares;
  }
  
  public isValidMove(piece: Piece, toX: number, toY: number): boolean {
    const pos = piece.getPosition();
    return this.moveValidator.validateMove(piece, pos.x, pos.y, toX, toY);
  }
  
  public findForcedCaptures(color: Color): Piece[] {
    const piecesWithCaptures: Piece[] = [];
    
    // Find all pieces of the given color
    const playerPieces = this.pieces.filter(piece => piece.getColor() === color);
    
    // Check each piece for possible captures
    for (const piece of playerPieces) {
      const legalMoves = this.findLegalMoves(piece);
      
      // Check if any legal move is a capture
      const hasCapture = legalMoves.some(square => square.isOccupied());
      
      if (hasCapture) {
        piecesWithCaptures.push(piece);
      }
    }
    
    return piecesWithCaptures;
  }
  
  public getPieceAt(x: number, y: number): Piece | null {
    if (x < 0 || x >= Constants.BOARD_SIZE || y < 0 || y >= Constants.BOARD_SIZE) {
      return null;
    }
    
    return this.squares[y][x].getPiece();
  }
  
  public getSquareAt(x: number, y: number): Square {
    if (x < 0 || x >= Constants.BOARD_SIZE || y < 0 || y >= Constants.BOARD_SIZE) {
      throw new Error(`Square position out of bounds: ${x}, ${y}`);
    }
    
    return this.squares[y][x];
  }
  
  public highlightSquares(squares: Square[]): void {
    squares.forEach(square => {
      if (square.isOccupied()) {
        square.highlight(Constants.CAPTURE_HIGHLIGHT_COLOR);
      } else {
        square.highlight(Constants.MOVE_HIGHLIGHT_COLOR);
      }
    });
  }
  
  public clearHighlights(): void {
    for (let y = 0; y < Constants.BOARD_SIZE; y++) {
      for (let x = 0; x < Constants.BOARD_SIZE; x++) {
        this.squares[y][x].clearHighlight();
      }
    }
  }
  
  public getSquares(): Square[][] {
    return this.squares;
  }
  
  public getContainer(): PIXI.Container {
    return this.container;
  }
  
  public update(delta: number): void {
    // Update all pieces
    this.pieces.forEach(piece => piece.update());
  }
  
  public getSquareAtPosition(position: PIXI.Point): Square | null {
    // Convert global position to board coordinates
    const boardPos = this.container.toLocal(position);
    const x = Math.floor(boardPos.x / Constants.SQUARE_SIZE);
    const y = Math.floor(boardPos.y / Constants.SQUARE_SIZE);
    
    // Check if coordinates are within board bounds
    if (x >= 0 && x < Constants.BOARD_SIZE && y >= 0 && y < Constants.BOARD_SIZE) {
      return this.squares[y][x];
    }
    
    return null;
  }
} 