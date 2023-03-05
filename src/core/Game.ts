/**
 * Game class for Anti-Chess
 * 
 * This is the main controller class that:
 * - Sets up the PIXI application
 * - Initializes the game board and pieces
 * - Manages the game state and turn logic
 * - Handles input events
 * - Controls the game loop
 */

import * as PIXI from 'pixi.js';
import { Board } from '@/entities/Board';
import { GameState } from '@/utils/GameState';
import { UI } from '@/ui/UI';
import { Constants } from '@/utils/Constants';
import { Piece } from '@/entities/Piece';
import { Square } from '@/entities/Square';
import { Color } from '@/utils/Types';
import { AssetLoader } from '@/utils/AssetLoader';

export class Game {
  private app: PIXI.Application;
  private board: Board;
  private gameState: GameState;
  private ui: UI;
  private selectedPiece: Piece | null = null;
  private assetLoader: AssetLoader;
  private initialized: boolean = false;
  
  constructor() {
    // Initialize PIXI application
    this.app = new PIXI.Application({
      width: Constants.BOARD_SIZE * Constants.SQUARE_SIZE + Constants.SIDEBAR_WIDTH,
      height: Constants.BOARD_SIZE * Constants.SQUARE_SIZE,
      backgroundColor: 0xEEEEEE,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      powerPreference: 'high-performance'
    });
    
    // Store the application as a global reference for pieces
    (globalThis as any).__PIXI_APP = this.app;
    
    // Initialize asset loader
    this.assetLoader = AssetLoader.getInstance();
    
    // Set up game state
    this.gameState = new GameState();
    
    // Create board and UI
    this.board = new Board();
    this.ui = new UI(this.gameState);
  }
  
  public async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Add the PIXI canvas to the DOM
      document.body.appendChild(this.app.view as HTMLCanvasElement);
      
      // Load assets first
      await this.assetLoader.loadAssets();
      
      // Initialize the board and UI
      await this.board.init();
      await this.ui.init();
      
      // Add board and UI containers to the stage
      this.app.stage.addChild(this.board.getContainer());
      this.app.stage.addChild(this.ui.getContainer());
      
      // Set up initial pieces
      this.board.setupPieces();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set up the game ticker
      this.app.ticker.add(this.update.bind(this));
      
      // Update UI initially
      this.ui.updateStatus();
      
      // Handle window resize
      window.addEventListener('resize', this.onResize.bind(this));
      this.onResize();
      
      this.initialized = true;
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      // Clean up any partially initialized resources
      this.cleanup();
      throw error;
    }
  }
  
  private cleanup(): void {
    // Remove event listeners
    window.removeEventListener('resize', this.onResize.bind(this));
    
    // Remove the canvas from the DOM
    if (this.app.view.parentNode) {
      this.app.view.parentNode.removeChild(this.app.view);
    }
    
    // Destroy PIXI application
    this.app.destroy(true);
  }
  
  public start(): void {
    // Start the game
    this.gameState.startGame();
    this.ui.updateStatus();
    this.ui.showMessage("Game started. White's turn.");
  }
  
  private update(delta: number): void {
    // Skip updates if game isn't playing
    if (this.gameState.getStatus() !== 'playing') {
      return;
    }
    
    // Update game components
    this.board.update(delta);
    
    // Update UI
    this.ui.updateStatus();
    
    // Check for win conditions
    if (this.gameState.checkWinCondition()) {
      const winner = this.gameState.getCurrentPlayer() === Color.WHITE ? 'Black' : 'White';
      this.ui.showMessage(`Game over! ${winner} wins!`);
    }
  }
  
  private setupEventListeners(): void {
    // Set up board square interaction
    this.board.getSquares().forEach((row: Square[]) => {
      row.forEach((square: Square) => {
        const graphics = square.getGraphics();
        graphics.eventMode = 'static';
        graphics.cursor = 'pointer';
        
        // Handle square click (select and move pieces)
        graphics.on('pointerdown', () => {
          const position = square.getPosition();
          
          // If we already have a piece selected
          if (this.selectedPiece) {
            // Try to move the selected piece to this square
            const fromPos = this.selectedPiece.getPosition();
            const success = this.board.movePiece(
              fromPos.x, fromPos.y, 
              position.x, position.y
            );
            
            if (success) {
              // Record the move in game state
              this.gameState.recordMove({
                fromX: fromPos.x,
                fromY: fromPos.y,
                toX: position.x,
                toY: position.y,
                piece: this.selectedPiece.getType(),
                color: this.selectedPiece.getColor(),
                isCapture: square.isOccupied(),
                capturedPiece: square.getPiece()?.getType()
              });
              
              // Switch turns
              this.gameState.switchPlayer();
              this.ui.updateStatus();
              this.ui.updateCapturedPieces();
              
              // Check for forced captures on the next turn
              this.checkForcedCaptures();
            }
            
            // Clear the selection and highlights
            this.selectedPiece = null;
            this.board.clearHighlights();
          } else {
            // Try to select a piece
            const piece = square.getPiece();
            
            // Can only select pieces of the current player's color
            if (piece && piece.getColor() === this.gameState.getCurrentPlayer()) {
              this.selectedPiece = piece;
              
              // Highlight the selected piece's square
              square.highlight();
              
              // Highlight valid moves for this piece
              const validMoves = this.board.findLegalMoves(piece);
              this.board.highlightSquares(validMoves);
            }
          }
        });
      });
    });
  }
  
  private onResize(): void {
    // Adjust the canvas size based on window dimensions
    const width = Math.min(
      window.innerWidth,
      Constants.BOARD_SIZE * Constants.SQUARE_SIZE + Constants.SIDEBAR_WIDTH
    );
    const height = Math.min(
      window.innerHeight,
      Constants.BOARD_SIZE * Constants.SQUARE_SIZE
    );
    
    // Update renderer size
    this.app.renderer.resize(width, height);
    
    // Update UI layout
    this.ui.resize(width, height);
  }
  
  private checkForcedCaptures(): void {
    // In Anti-Chess, a player must capture if possible
    // Check if the current player has any capturing moves
    const currentPlayer = this.gameState.getCurrentPlayer();
    const forcedCaptures = this.board.findForcedCaptures(currentPlayer);
    
    if (forcedCaptures.length > 0) {
      this.ui.showMessage(`${currentPlayer === Color.WHITE ? 'White' : 'Black'} must capture!`);
      // Highlight the pieces that must make a capture
      forcedCaptures.forEach((piece: Piece) => {
        const pos = piece.getPosition();
        const square = this.board.getSquareAt(pos.x, pos.y);
        square.highlight(Constants.CAPTURE_HIGHLIGHT_COLOR);
      });
    }
  }
} 