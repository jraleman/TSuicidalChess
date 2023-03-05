/**
 * AssetLoader class for Anti-Chess
 * 
 * Responsibilities:
 * - Loads and manages game assets (textures, images, etc.)
 * - Provides access to loaded assets
 * - Handles asset loading states
 * - Manages asset paths and organization
 */

import * as PIXI from 'pixi.js';
import { PieceType, Color } from './Types';
import { Constants } from './Constants';

export class AssetLoader {
  private textures: Map<string, PIXI.Texture>;
  private isLoaded: boolean;
  private basePath: string;
  
  constructor() {
    this.textures = new Map();
    this.isLoaded = false;
    this.basePath = Constants.PIECE_SPRITE_PATH;
  }
  
  public async loadAssets(): Promise<void> {
    try {
      // Create a list of all piece textures to load
      const pieceTypes = Object.values(PieceType);
      const colors = Object.values(Color);
      
      // Load textures for each piece type and color combination
      for (const type of pieceTypes) {
        for (const color of colors) {
          const key = this.getAssetKey(type, color);
          const path = this.getAssetPath(type, color);
          
          try {
            // Load the texture
            const texture = await PIXI.Assets.load(path);
            this.textures.set(key, texture);
          } catch (error) {
            console.warn(`Failed to load texture for ${key}:`, error);
            // Create a fallback texture if loading fails
            this.createFallbackTexture(type, color);
          }
        }
      }
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load assets:', error);
      throw error;
    }
  }
  
  public getPieceTexture(type: PieceType, color: Color): PIXI.Texture {
    const key = this.getAssetKey(type, color);
    const texture = this.textures.get(key);
    
    if (!texture) {
      console.warn(`Texture not found for ${key}, creating fallback`);
      return this.createFallbackTexture(type, color);
    }
    
    return texture;
  }
  
  public isAssetsLoaded(): boolean {
    return this.isLoaded;
  }
  
  public getAssetPath(type: PieceType, color: Color): string {
    // Construct the path to the asset
    // Format: assets/images/pieces/{color}/{type}.png
    return `${this.basePath}${color}/${type}.png`;
  }
  
  private getAssetKey(type: PieceType, color: Color): string {
    // Create a unique key for the texture
    return `${color}_${type}`;
  }
  
  private createFallbackTexture(type: PieceType, color: Color): PIXI.Texture {
    // Create a simple colored rectangle as a fallback texture
    const graphics = new PIXI.Graphics();
    const size = Constants.SQUARE_SIZE * 0.7;
    
    // Set the color based on piece color
    const fillColor = color === Color.WHITE ? 0xFFFFFF : 0x000000;
    graphics.beginFill(fillColor);
    graphics.lineStyle(2, 0x999999);
    
    // Draw different shapes based on piece type
    switch (type) {
      case PieceType.PAWN:
        graphics.drawCircle(size/2, size/2, size/2);
        break;
      case PieceType.ROOK:
        graphics.drawRect(0, 0, size, size);
        break;
      case PieceType.KNIGHT:
        graphics.drawPolygon([
          0, size,
          size/2, 0,
          size, size
        ]);
        break;
      case PieceType.BISHOP:
        graphics.drawPolygon([
          size/2, 0,
          size, size,
          0, size
        ]);
        break;
      case PieceType.QUEEN:
        this.drawStar(graphics, size/2, size/2, 5, size/2, size/4);
        break;
      case PieceType.KING:
        this.drawStar(graphics, size/2, size/2, 6, size/2, size/3);
        break;
    }
    
    graphics.endFill();
    
    // Add text for piece type
    const style = new PIXI.TextStyle({
      fontSize: 16,
      fill: color === Color.WHITE ? '#000000' : '#FFFFFF',
    });
    
    const text = new PIXI.Text(this.getPieceSymbol(type), style);
    text.anchor.set(0.5);
    text.position.set(size/2, size/2);
    graphics.addChild(text);
    
    // Generate texture from graphics
    const texture = PIXI.RenderTexture.create({
      width: size,
      height: size,
    });
    
    // Store the texture
    const key = this.getAssetKey(type, color);
    this.textures.set(key, texture);
    
    return texture;
  }
  
  private drawStar(
    graphics: PIXI.Graphics,
    centerX: number,
    centerY: number,
    points: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    const step = Math.PI / points;
    const vertices: number[] = [];
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step;
      
      vertices.push(
        centerX + radius * Math.sin(angle),
        centerY - radius * Math.cos(angle)
      );
    }
    
    graphics.drawPolygon(vertices);
  }
  
  private getPieceSymbol(type: PieceType): string {
    switch (type) {
      case PieceType.PAWN: return 'P';
      case PieceType.ROOK: return 'R';
      case PieceType.KNIGHT: return 'N';
      case PieceType.BISHOP: return 'B';
      case PieceType.QUEEN: return 'Q';
      case PieceType.KING: return 'K';
      default: return '';
    }
  }
} 