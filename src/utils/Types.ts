/**
 * Types for Anti-Chess
 * 
 * This file contains type definitions and enums used throughout the game.
 */

// Piece types
export enum PieceType {
  PAWN = 'pawn',
  ROOK = 'rook',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  QUEEN = 'queen',
  KING = 'king'
}

// Player colors
export enum Color {
  WHITE = 'white',
  BLACK = 'black'
}

// Game states
export enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  GAME_OVER = 'game_over'
}

// Move types
export interface Move {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  piece: PieceType;
  color: Color;
  isCapture: boolean;
  capturedPiece?: PieceType;
}

// Position interface
export interface Position {
  x: number;
  y: number;
} 