/**
 * Constants for Anti-Chess
 * 
 * This file contains game-wide constants for configuration.
 */

export const Constants = {
  // Board dimensions
  BOARD_SIZE: 8, // 8x8 chess board
  SQUARE_SIZE: 80, // Size of each square in pixels
  
  // Colors
  LIGHT_SQUARE_COLOR: 0xE8D0AA, // Light squares
  DARK_SQUARE_COLOR: 0xB58863, // Dark squares
  HIGHLIGHT_COLOR: 0xFFFF00, // Yellow highlight
  MOVE_HIGHLIGHT_COLOR: 0x00FF00, // Green highlight for valid moves
  CAPTURE_HIGHLIGHT_COLOR: 0xFF0000, // Red highlight for captures
  
  // Game settings
  ANIMATION_SPEED: 0.2, // Animation speed in seconds
  
  // Asset paths
  PIECE_SPRITE_PATH: 'assets/images/pieces/', // Path to piece sprites
  
  // UI settings
  SIDEBAR_WIDTH: 250, // Width of the sidebar
  BUTTON_HEIGHT: 40, // Height of buttons
  SHOW_COORDINATES: true, // Show coordinates on board squares
  
  // Game rules specific to Anti-Chess
  MUST_CAPTURE: true, // In Anti-Chess, capturing is mandatory if possible
  KING_CAN_BE_CAPTURED: true, // The king is treated as a normal piece
  PAWN_PROMOTION_TYPES: ['queen', 'rook', 'bishop', 'knight'] // Pawns can promote to these pieces
}; 