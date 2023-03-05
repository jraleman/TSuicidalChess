/**
 * Utility functions for Anti-Chess
 * 
 * This file contains helper functions used throughout the game.
 */

import { Position } from './Types';
import { Constants } from './Constants';

/**
 * Converts board coordinates to screen coordinates
 */
export function boardToScreenPosition(x: number, y: number): Position {
  return {
    x: x * Constants.SQUARE_SIZE,
    y: y * Constants.SQUARE_SIZE
  };
}

/**
 * Converts screen coordinates to board coordinates
 */
export function screenToBoardPosition(x: number, y: number): Position {
  return {
    x: Math.floor(x / Constants.SQUARE_SIZE),
    y: Math.floor(y / Constants.SQUARE_SIZE)
  };
}

/**
 * Formats a board position in algebraic notation (e.g., "e4")
 */
export function formatPosition(x: number, y: number): string {
  if (x < 0 || x >= Constants.BOARD_SIZE || y < 0 || y >= Constants.BOARD_SIZE) {
    return 'invalid';
  }
  
  const file = String.fromCharCode(97 + x); // a, b, c, ...
  const rank = 8 - y; // 8, 7, 6, ...
  
  return `${file}${rank}`;
}

/**
 * Parses algebraic notation into board coordinates
 */
export function parsePosition(position: string): Position | null {
  if (position.length !== 2) {
    return null;
  }
  
  const file = position.charAt(0).toLowerCase();
  const rank = position.charAt(1);
  
  if (file < 'a' || file > 'h' || rank < '1' || rank > '8') {
    return null;
  }
  
  return {
    x: file.charCodeAt(0) - 97, // 'a' -> 0, 'b' -> 1, ...
    y: 8 - parseInt(rank) // '8' -> 0, '7' -> 1, ...
  };
}

/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Delays execution for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if a position is within the board bounds
 */
export function isValidPosition(x: number, y: number): boolean {
  return x >= 0 && x < Constants.BOARD_SIZE && y >= 0 && y < Constants.BOARD_SIZE;
}

/**
 * Deep clones an object
 */
export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Formats a timestamp in mm:ss format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
} 