/**
 * Square class for Anti-Chess
 * 
 * Responsibilities:
 * - Represents a single square on the chess board
 * - Manages the visual representation of the square
 * - Handles square selection and highlighting
 * - Tracks the piece currently occupying the square
 */

import * as PIXI from 'pixi.js';
import { Piece } from './Piece';
import { Constants } from '@/utils/Constants';

export class Square {
  private graphics: PIXI.Graphics;
  private piece: Piece | null = null;
  private x: number;
  private y: number;
  private isLight: boolean;
  private isHighlighted: boolean = false;
  
  constructor(x: number, y: number, isLight: boolean) {
    // Initialize square properties
    this.x = x;
    this.y = y;
    this.isLight = isLight;
    
    // Create graphics for the square
    this.graphics = new PIXI.Graphics();
    this.drawSquare();
    
    // Set position
    this.graphics.position.set(
      x * Constants.SQUARE_SIZE,
      y * Constants.SQUARE_SIZE
    );
  }
  
  private drawSquare(): void {
    this.graphics.clear();
    
    // Draw the square with the appropriate color
    const color = this.isHighlighted 
      ? this.isLight ? 0xFFFF99 : 0xDDDD66
      : this.isLight ? Constants.LIGHT_SQUARE_COLOR : Constants.DARK_SQUARE_COLOR;
    
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, Constants.SQUARE_SIZE, Constants.SQUARE_SIZE);
    this.graphics.endFill();
    
    // Add coordinates text for debugging
    if (Constants.SHOW_COORDINATES) {
      const style = new PIXI.TextStyle({
        fontSize: 10,
        fill: this.isLight ? '#555555' : '#BBBBBB',
      });
      
      const text = new PIXI.Text(`${String.fromCharCode(97 + this.x)}${8 - this.y}`, style);
      text.position.set(2, 2);
      this.graphics.addChild(text);
    }
  }
  
  public setPiece(piece: Piece | null): void {
    this.piece = piece;
  }
  
  public getPiece(): Piece | null {
    return this.piece;
  }
  
  public getPosition(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }
  
  public highlight(color: number = Constants.HIGHLIGHT_COLOR): void {
    this.isHighlighted = true;
    
    // Store the current children
    const children = [...this.graphics.children];
    
    // Clear and redraw with highlight
    this.graphics.clear();
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, Constants.SQUARE_SIZE, Constants.SQUARE_SIZE);
    this.graphics.endFill();
    
    // Add border for better visibility
    this.graphics.lineStyle(2, 0xFFFFFF, 0.8);
    this.graphics.drawRect(2, 2, Constants.SQUARE_SIZE - 4, Constants.SQUARE_SIZE - 4);
    
    // Re-add the children (like coordinate text)
    children.forEach(child => this.graphics.addChild(child));
  }
  
  public clearHighlight(): void {
    this.isHighlighted = false;
    
    // Store the current children
    const children = [...this.graphics.children];
    
    // Redraw without highlight
    this.drawSquare();
    
    // Re-add the children if they exist
    children.forEach(child => this.graphics.addChild(child));
  }
  
  public isOccupied(): boolean {
    return this.piece !== null;
  }
  
  public getScreenPosition(): { x: number, y: number } {
    return { 
      x: this.x * Constants.SQUARE_SIZE,
      y: this.y * Constants.SQUARE_SIZE
    };
  }
  
  public getGraphics(): PIXI.Graphics {
    return this.graphics;
  }
} 