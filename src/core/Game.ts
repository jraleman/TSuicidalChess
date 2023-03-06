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
  private isDragging: boolean = false;
  private dragOffset: PIXI.Point = new PIXI.Point();
  private originalPosition: PIXI.Point = new PIXI.Point();
  private draggedSprite: PIXI.Sprite | null = null;
  
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
        
        // Handle square click/touch (select and move pieces)
        graphics.on('pointerdown', (event: PIXI.FederatedPointerEvent) => {
          const position = square.getPosition();
          const piece = square.getPiece();
          
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
            if (piece && piece.getColor() === this.gameState.getCurrentPlayer()) {
              this.selectedPiece = piece;
              
              // Highlight the selected piece's square
              square.highlight();
              
              // Highlight valid moves for this piece
              const validMoves = this.board.findLegalMoves(piece);
              this.board.highlightSquares(validMoves);
              
              // Start dragging for both mouse and touch events
              this.startDragging(piece, event);
            }
          }
        });
      });
    });
    
    // Set up global pointer events for dragging
    this.app.stage.eventMode = 'static';
    
    this.app.stage.on('pointermove', (event: PIXI.FederatedPointerEvent) => {
      if (this.isDragging && this.draggedSprite) {
        const newPosition = event.getLocalPosition(this.app.stage);
        this.draggedSprite.position.set(
          newPosition.x - this.dragOffset.x,
          newPosition.y - this.dragOffset.y
        );
      }
    });
    
    this.app.stage.on('pointerup', () => {
      if (this.isDragging && this.draggedSprite) {
        this.endDragging();
      }
    });
    
    this.app.stage.on('pointerupoutside', () => {
      if (this.isDragging && this.draggedSprite) {
        this.endDragging();
      }
    });
  }
  
  private startDragging(piece: Piece, event: PIXI.FederatedPointerEvent): void {
    this.isDragging = true;
    this.selectedPiece = piece;
    
    // Create a sprite for dragging
    const sprite = piece.getSprite();
    this.draggedSprite = new PIXI.Sprite(sprite.texture);
    this.draggedSprite.anchor.set(0.5);
    this.draggedSprite.alpha = 0.8;
    
    // Calculate drag offset
    const localPos = event.getLocalPosition(sprite);
    this.dragOffset = new PIXI.Point(localPos.x, localPos.y);
    
    // Store original position
    this.originalPosition = new PIXI.Point(sprite.x, sprite.y);
    
    // Add dragged sprite to stage
    this.app.stage.addChild(this.draggedSprite);
    
    // Hide original piece
    sprite.visible = false;
  }
  
  private endDragging(): void {
    if (!this.draggedSprite || !this.selectedPiece) {
      return;
    }
    
    // Get the square under the dragged piece
    const dropPosition = this.draggedSprite.position;
    const square = this.board.getSquareAtPosition(dropPosition);
    
    if (square) {
      const fromPos = this.selectedPiece.getPosition();
      const toPos = square.getPosition();
      
      // Try to move the piece
      const success = this.board.movePiece(
        fromPos.x, fromPos.y,
        toPos.x, toPos.y
      );
      
      if (success) {
        // Record the move in game state
        this.gameState.recordMove({
          fromX: fromPos.x,
          fromY: fromPos.y,
          toX: toPos.x,
          toY: toPos.y,
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
      } else {
        // Move piece back to original position
        this.selectedPiece.getSprite().position.copyFrom(this.originalPosition);
      }
    }
    
    // Clean up dragging state
    this.draggedSprite.destroy();
    this.draggedSprite = null;
    this.selectedPiece.getSprite().visible = true;
    this.selectedPiece = null;
    this.isDragging = false;
    this.board.clearHighlights();
  }
  
  private onResize(): void {
    // Calculate the scale factor based on window size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const targetWidth = Constants.BOARD_SIZE * Constants.SQUARE_SIZE + Constants.SIDEBAR_WIDTH;
    const targetHeight = Constants.BOARD_SIZE * Constants.SQUARE_SIZE;
    
    const scaleX = windowWidth / targetWidth;
    const scaleY = windowHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size
    
    // Update renderer size
    this.app.renderer.resize(windowWidth, windowHeight);
    
    // Center the game board
    const boardContainer = this.board.getContainer();
    const uiContainer = this.ui.getContainer();
    
    boardContainer.scale.set(scale);
    uiContainer.scale.set(scale);
    
    // Position containers
    const boardX = (windowWidth - targetWidth * scale) / 2;
    const boardY = (windowHeight - targetHeight * scale) / 2;
    
    boardContainer.position.set(boardX, boardY);
    uiContainer.position.set(boardX + targetWidth * scale, boardY);
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