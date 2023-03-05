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
    // TODO: Add a piece to the player's collection
  }
  
  public removePiece(piece: Piece): void {
    // TODO: Remove a piece from the player's collection
  }
  
  public addCapturedPiece(piece: Piece): void {
    // TODO: Add a captured piece to the player's collection
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