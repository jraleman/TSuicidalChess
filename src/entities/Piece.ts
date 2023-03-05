/**
 * Piece class for Anti-Chess
 * 
 * Responsibilities:
 * - Represents a chess piece (pawn, rook, knight, bishop, queen, king)
 * - Manages the piece's visual representation
 * - Tracks the piece's position on the board
 * - Handles piece-specific movement rules
 * - Defines capture behavior
 */

import * as PIXI from 'pixi.js';
import { PieceType, Color } from '@/utils/Types';
import { Constants } from '@/utils/Constants';

export class Piece {
  private sprite: PIXI.Sprite;
  private type: PieceType;
  private color: Color;
  private x: number = 0;
  private y: number = 0;
  private isDragging: boolean = false;
  
  constructor(type: PieceType, color: Color, x: number, y: number) {
    // Initialize piece properties
    this.type = type;
    this.color = color;
    this.x = x;
    this.y = y;
    
    // Create a simple colored rectangle as placeholder for the piece
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color === Color.WHITE ? 0xFFFFFF : 0x000000);
    graphics.lineStyle(2, 0x999999, 1);
    
    const pieceSize = Constants.SQUARE_SIZE * 0.7;
    const margin = (Constants.SQUARE_SIZE - pieceSize) / 2;
    
    switch (type) {
      case PieceType.PAWN:
        graphics.drawCircle(pieceSize/2, pieceSize/2, pieceSize/2);
        break;
      case PieceType.ROOK:
        graphics.drawRect(0, 0, pieceSize, pieceSize);
        break;
      case PieceType.KNIGHT:
        graphics.drawPolygon([
          0, pieceSize,
          pieceSize/2, 0,
          pieceSize, pieceSize
        ]);
        break;
      case PieceType.BISHOP:
        graphics.drawPolygon([
          pieceSize/2, 0,
          pieceSize, pieceSize,
          0, pieceSize
        ]);
        break;
      case PieceType.QUEEN:
        graphics.drawStar(pieceSize/2, pieceSize/2, 5, pieceSize/2, pieceSize/4);
        break;
      case PieceType.KING:
        graphics.drawStar(pieceSize/2, pieceSize/2, 6, pieceSize/2, pieceSize/3);
        break;
    }
    
    graphics.endFill();
    
    // Create sprite from graphics
    const texture = this.app.renderer.generateTexture(graphics);
    this.sprite = new PIXI.Sprite(texture);
    
    // Set initial position
    this.updateSpritePosition();
    
    // Make the piece interactive
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    
    // Add text for piece type
    const style = new PIXI.TextStyle({
      fontSize: 16,
      fill: color === Color.WHITE ? '#000000' : '#FFFFFF',
    });
    
    const text = new PIXI.Text(this.getPieceSymbol(), style);
    text.anchor.set(0.5);
    text.position.set(pieceSize/2, pieceSize/2);
    this.sprite.addChild(text);
  }
  
  private get app(): PIXI.Application {
    // This is a hack to access the renderer since we don't have a direct reference
    // In a real implementation, you'd pass the application or renderer as a parameter
    return (globalThis as any).__PIXI_APP as PIXI.Application;
  }
  
  private getPieceSymbol(): string {
    switch (this.type) {
      case PieceType.PAWN: return 'P';
      case PieceType.ROOK: return 'R';
      case PieceType.KNIGHT: return 'N';
      case PieceType.BISHOP: return 'B';
      case PieceType.QUEEN: return 'Q';
      case PieceType.KING: return 'K';
      default: return '';
    }
  }
  
  public getType(): PieceType {
    return this.type;
  }
  
  public getColor(): Color {
    return this.color;
  }
  
  public getPosition(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }
  
  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.updateSpritePosition();
  }
  
  private updateSpritePosition(): void {
    const squareSize = Constants.SQUARE_SIZE;
    this.sprite.position.set(
      this.x * squareSize + squareSize * 0.15,
      this.y * squareSize + squareSize * 0.15
    );
  }
  
  public canCapture(targetPiece: Piece): boolean {
    // In standard chess, any piece can capture an opponent's piece
    // In Anti-Chess, the capture logic remains the same, but it's mandatory
    return targetPiece.color !== this.color;
  }
  
  public startDrag(): void {
    this.isDragging = true;
    this.sprite.alpha = 0.6;
    this.sprite.zIndex = 10;
  }
  
  public stopDrag(): void {
    this.isDragging = false;
    this.sprite.alpha = 1;
    this.sprite.zIndex = 1;
    this.updateSpritePosition();
  }
  
  public update(): void {
    // Update piece state (animations, etc.)
    if (this.isDragging) {
      // This would be used for drag and drop functionality
      // Not implemented in this basic version
    }
  }
  
  public getSprite(): PIXI.Sprite {
    return this.sprite;
  }
} 