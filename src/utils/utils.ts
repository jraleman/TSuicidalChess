/**
 * Utility functions for Anti-Chess
 * 
 * Contains helper functions used throughout the game
 */

import { Position } from './Types';
import { Constants } from './Constants';

/**
 * Converts a board position to screen coordinates
 */
export function boardToScreenPosition(x: number, y: number): Position {
  // TODO: Convert board coordinates (0-7, 0-7) to screen pixels
  return {
    x: 0,
    y: 0
  };
}

/**
 * Converts screen coordinates to a board position
 */
export function screenToBoardPosition(x: number, y: number): Position {
  // TODO: Convert screen pixels to board coordinates (0-7, 0-7)
  return {
    x: 0,
    y: 0
  };
}

/**
 * Checks if a position is within the board boundaries
 */
export function isPositionInBounds(x: number, y: number): boolean {
  // TODO: Check if coordinates are within 0-7 range
  return false;
}

/**
 * Converts algebraic notation (e.g., 'e4') to board coordinates
 */
export function algebraicToCoordinates(algebraic: string): Position | null {
  // TODO: Convert algebraic notation to coordinates
  return null;
}

/**
 * Converts board coordinates to algebraic notation
 */
export function coordinatesToAlgebraic(x: number, y: number): string {
  // TODO: Convert coordinates to algebraic notation
  return '';
}

/**
 * Delays execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculates the Manhattan distance between two positions
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
  // TODO: Calculate Manhattan distance
  return 0;
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  // TODO: Implement deep clone
  return obj;
} 