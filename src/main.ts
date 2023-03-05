/**
 * Main entry point for the Anti-Chess game.
 * This file initializes the game and starts the render loop.
 */

import { Game } from '@/core/Game';

// Create a new game instance
const game = new Game();

// Initialize the game
game.init();

// Start the game loop
game.start(); 