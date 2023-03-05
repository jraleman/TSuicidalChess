/**
 * Player class for Anti-Chess
 * 
 * Responsibilities:
 * - Represents a player in the game
 * - Keeps track of player's pieces
 * - Manages player-specific data and state
 * - Tracks captured pieces
 */

import { Color } from '@/utils/Types';
import { Piece } from './Piece';

export class Player {
  private color: Color;
  private pieces: Piece[];
  private capturedPieces: Piece[];
  private isAI: boolean;
  
  constructor(color: Color, isAI: boolean = false) {
    this.color = color;
    this.pieces = [];
    this.capturedPieces = [];
    this.isAI = isAI;
  }
  
  public getColor(): Color {
    return this.color;
  }
  
  public getPieces(): Piece[] {
    return this.pieces;
  }
  
  public addPiece(piece: Piece): void {
    // Add a piece to the player's collection
    // Verify the piece matches the player's color
    if (piece.getColor() !== this.color) {
      throw new Error(`Cannot add piece of color ${piece.getColor()} to player of color ${this.color}`);
    }
    
    // Check if the piece is already in the collection
    if (this.pieces.includes(piece)) {
      throw new Error('Piece is already in the player\'s collection');
    }
    
    this.pieces.push(piece);
  }
  
  public removePiece(piece: Piece): void {
    // Remove a piece from the player's collection
    const index = this.pieces.indexOf(piece);
    
    if (index === -1) {
      throw new Error('Piece not found in player\'s collection');
    }
    
    this.pieces.splice(index, 1);
  }
  
  public addCapturedPiece(piece: Piece): void {
    // Add a captured piece to the player's collection
    // Verify the piece is of the opposite color
    if (piece.getColor() === this.color) {
      throw new Error(`Cannot add piece of color ${piece.getColor()} to captured pieces of player of color ${this.color}`);
    }
    
    // Check if the piece is already in the captured collection
    if (this.capturedPieces.includes(piece)) {
      throw new Error('Piece is already in the player\'s captured pieces');
    }
    
    this.capturedPieces.push(piece);
  }
  
  public getCapturedPieces(): Piece[] {
    return this.capturedPieces;
  }
  
  public hasRemainingPieces(): boolean {
    return this.pieces.length > 0;
  }
  
  public isAIPlayer(): boolean {
    return this.isAI;
  }
} 