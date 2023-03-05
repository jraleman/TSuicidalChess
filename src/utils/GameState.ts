/**
 * GameState class for Anti-Chess
 * 
 * Responsibilities:
 * - Tracks the current game state
 * - Manages the current player's turn
 * - Tracks game history and moves
 * - Determines win conditions
 * - Handles game rules specific to Anti-Chess
 */

import { Color, GameStatus, Move } from './Types';

export class GameState {
  private currentPlayer: Color = Color.WHITE;
  private status: GameStatus = GameStatus.WAITING;
  private moveHistory: Move[] = [];
  private capturedPieces: Map<Color, string[]> = new Map([
    [Color.WHITE, []],
    [Color.BLACK, []]
  ]);
  
  constructor() {
    // Initialize with default values
    this.reset();
  }
  
  public getCurrentPlayer(): Color {
    return this.currentPlayer;
  }
  
  public getStatus(): GameStatus {
    return this.status;
  }
  
  public switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === Color.WHITE ? Color.BLACK : Color.WHITE;
  }
  
  public recordMove(move: Move): void {
    this.moveHistory.push(move);
    
    // Update captured pieces if the move was a capture
    if (move.isCapture && move.capturedPiece) {
      const capturedColor = move.color === Color.WHITE ? Color.BLACK : Color.WHITE;
      const pieces = this.capturedPieces.get(capturedColor) || [];
      pieces.push(move.capturedPiece);
      this.capturedPieces.set(capturedColor, pieces);
    }
  }
  
  public getLastMove(): Move | null {
    if (this.moveHistory.length === 0) {
      return null;
    }
    return this.moveHistory[this.moveHistory.length - 1];
  }
  
  public getCapturedPieces(color: Color): string[] {
    return this.capturedPieces.get(color) || [];
  }
  
  public checkWinCondition(): boolean {
    // In Anti-Chess, you win by losing all your pieces
    // Check if either player has no pieces left
    
    // If white has no pieces left, black wins
    if (this.capturedPieces.get(Color.WHITE)?.length === 16) {
      this.status = GameStatus.GAME_OVER;
      return true;
    }
    
    // If black has no pieces left, white wins
    if (this.capturedPieces.get(Color.BLACK)?.length === 16) {
      this.status = GameStatus.GAME_OVER;
      return true;
    }
    
    return false;
  }
  
  public reset(): void {
    this.currentPlayer = Color.WHITE;
    this.status = GameStatus.WAITING;
    this.moveHistory = [];
    this.capturedPieces = new Map([
      [Color.WHITE, []],
      [Color.BLACK, []]
    ]);
  }
  
  public startGame(): void {
    this.status = GameStatus.PLAYING;
  }
  
  public getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }
} 