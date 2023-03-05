/**
 * UI class for Anti-Chess
 * 
 * Responsibilities:
 * - Manages the game's user interface elements
 * - Handles UI-related events
 * - Displays game status and messages
 * - Shows captured pieces
 * - Provides UI for pawn promotion
 */

import * as PIXI from 'pixi.js';
import { GameState } from '@/utils/GameState';
import { Color, PieceType, GameStatus } from '@/utils/Types';
import { Constants } from '@/utils/Constants';

export class UI {
  private container: PIXI.Container;
  private gameState: GameState;
  private statusText: PIXI.Text;
  private capturedPiecesContainer: PIXI.Container;
  private promotionDialog: PIXI.Container;
  private messageText: PIXI.Text;
  
  constructor(gameState: GameState) {
    // Initialize UI elements
    this.gameState = gameState;
    this.container = new PIXI.Container();
    
    // Position the UI container
    this.container.position.set(
      Constants.BOARD_SIZE * Constants.SQUARE_SIZE,
      0
    );
    
    // Create text elements for game status
    const style = new PIXI.TextStyle({
      fontSize: 18,
      fill: '#000000',
    });
    
    this.statusText = new PIXI.Text('', style);
    this.statusText.position.set(20, 20);
    this.container.addChild(this.statusText);
    
    // Create text for messages
    this.messageText = new PIXI.Text('', style);
    this.messageText.position.set(20, 50);
    this.container.addChild(this.messageText);
    
    // Create container for captured pieces
    this.capturedPiecesContainer = new PIXI.Container();
    this.capturedPiecesContainer.position.set(20, 100);
    this.container.addChild(this.capturedPiecesContainer);
    
    // Create container for promotion dialog (hidden initially)
    this.promotionDialog = new PIXI.Container();
    this.promotionDialog.visible = false;
    this.container.addChild(this.promotionDialog);
  }
  
  public init(): void {
    // Initialize the UI
    this.updateStatus();
    this.updateCapturedPieces();
    
    // Create buttons
    const resetButton = this.createButton('Reset Game', 20, 400, () => {
      // Reset game state
      this.gameState.reset();
      this.updateStatus();
      this.updateCapturedPieces();
      this.showMessage('Game reset.');
      
      // We would typically emit an event here that the Game class would listen for
      // For simplicity, we'll just use a global event for now
      const event = new CustomEvent('game:reset');
      document.dispatchEvent(event);
    });
    
    this.container.addChild(resetButton);
  }
  
  public updateStatus(): void {
    // Update the status text based on current game state
    const status = this.gameState.getStatus();
    const player = this.gameState.getCurrentPlayer();
    
    let statusText = '';
    
    switch (status) {
      case GameStatus.WAITING:
        statusText = 'Waiting to start';
        break;
      case GameStatus.PLAYING:
        statusText = `${player === Color.WHITE ? 'White' : 'Black'}'s turn`;
        break;
      case GameStatus.GAME_OVER:
        statusText = 'Game Over';
        break;
    }
    
    this.statusText.text = statusText;
  }
  
  public updateCapturedPieces(): void {
    // Clear current display
    this.capturedPiecesContainer.removeChildren();
    
    // Display title
    const style = new PIXI.TextStyle({
      fontSize: 16,
      fill: '#000000',
    });
    
    const capturedTitle = new PIXI.Text('Captured Pieces:', style);
    this.capturedPiecesContainer.addChild(capturedTitle);
    
    // Get captured pieces for each player
    const whiteCaptured = this.gameState.getCapturedPieces(Color.WHITE);
    const blackCaptured = this.gameState.getCapturedPieces(Color.BLACK);
    
    // Display white's captured pieces
    const whiteText = new PIXI.Text('White: ' + whiteCaptured.join(', '), style);
    whiteText.position.set(0, 30);
    this.capturedPiecesContainer.addChild(whiteText);
    
    // Display black's captured pieces
    const blackText = new PIXI.Text('Black: ' + blackCaptured.join(', '), style);
    blackText.position.set(0, 60);
    this.capturedPiecesContainer.addChild(blackText);
  }
  
  public showMessage(message: string): void {
    // Display a message to the user
    this.messageText.text = message;
    
    // Clear the message after a delay
    setTimeout(() => {
      if (this.messageText.text === message) {
        this.messageText.text = '';
      }
    }, 5000);
  }
  
  public showPromotionDialog(x: number, y: number, color: Color, callback: (pieceType: PieceType) => void): void {
    // Clear existing dialog content
    this.promotionDialog.removeChildren();
    
    // Create background
    const background = new PIXI.Graphics();
    background.beginFill(0xFFFFFF);
    background.lineStyle(2, 0x000000);
    background.drawRect(0, 0, 200, 250);
    background.endFill();
    this.promotionDialog.addChild(background);
    
    // Create title
    const style = new PIXI.TextStyle({
      fontSize: 16,
      fill: '#000000',
    });
    
    const title = new PIXI.Text('Promote pawn to:', style);
    title.position.set(20, 20);
    this.promotionDialog.addChild(title);
    
    // Create buttons for each promotion type
    const promotionTypes = Constants.PAWN_PROMOTION_TYPES;
    
    for (let i = 0; i < promotionTypes.length; i++) {
      const pieceType = promotionTypes[i] as PieceType;
      
      const button = this.createButton(
        pieceType.charAt(0).toUpperCase() + pieceType.slice(1),
        20,
        60 + i * 40,
        () => {
          callback(pieceType);
          this.hidePromotionDialog();
        }
      );
      
      this.promotionDialog.addChild(button);
    }
    
    // Position and show the dialog
    this.promotionDialog.position.set(
      x * Constants.SQUARE_SIZE + Constants.SQUARE_SIZE/2 - 100,
      y * Constants.SQUARE_SIZE + Constants.SQUARE_SIZE/2 - 125
    );
    this.promotionDialog.visible = true;
  }
  
  public hidePromotionDialog(): void {
    // Hide the promotion dialog
    this.promotionDialog.visible = false;
  }
  
  public createButton(text: string, x: number, y: number, onClick: () => void): PIXI.Container {
    // Create a button with text and click handler
    const button = new PIXI.Container();
    button.position.set(x, y);
    
    // Create button background
    const background = new PIXI.Graphics();
    background.beginFill(0xCCCCCC);
    background.lineStyle(2, 0x999999);
    background.drawRoundedRect(0, 0, 140, Constants.BUTTON_HEIGHT, 8);
    background.endFill();
    button.addChild(background);
    
    // Create button text
    const style = new PIXI.TextStyle({
      fontSize: 14,
      fill: '#000000',
    });
    
    const buttonText = new PIXI.Text(text, style);
    buttonText.anchor.set(0.5);
    buttonText.position.set(70, Constants.BUTTON_HEIGHT/2);
    button.addChild(buttonText);
    
    // Make button interactive
    button.eventMode = 'static';
    button.cursor = 'pointer';
    
    // Add event listeners
    button.on('pointerdown', () => {
      background.tint = 0xAAAAAA;
    });
    
    button.on('pointerup', () => {
      background.tint = 0xFFFFFF;
      onClick();
    });
    
    button.on('pointerout', () => {
      background.tint = 0xFFFFFF;
    });
    
    return button;
  }
  
  public resize(width: number, height: number): void {
    // Adjust UI position based on board size
    this.container.position.set(
      Math.min(width - Constants.SIDEBAR_WIDTH, Constants.BOARD_SIZE * Constants.SQUARE_SIZE),
      0
    );
  }
  
  public getContainer(): PIXI.Container {
    return this.container;
  }
} 