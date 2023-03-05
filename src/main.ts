/**
 * Main entry point for Anti-Chess
 * 
 * This file:
 * - Creates and initializes the game
 * - Handles any global setup
 * - Starts the game loop
 */

import { Game } from '@/core/Game';

async function main() {
  try {
    // Create and initialize the game
    const game = new Game();
    await game.init();
    
    // Start the game
    game.start();
    
  } catch (error) {
    console.error('Failed to start game:', error);
    
    // Create and show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffebee;
      color: #c62828;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 80%;
    `;
    
    errorDiv.innerHTML = `
      <h2>Failed to Start Game</h2>
      <p>There was an error initializing the game. Please check the console for details.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onclick="window.location.reload()" style="
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #c62828;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      ">Retry</button>
    `;
    
    document.body.appendChild(errorDiv);
  }
}

// Start the game when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
} 