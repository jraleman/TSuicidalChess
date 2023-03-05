/**
 * AssetLoader class for Anti-Chess
 * 
 * Responsibilities:
 * - Loads and manages game assets (images, sprites, etc.)
 * - Provides access to loaded assets
 * - Handles loading errors
 */

import * as PIXI from 'pixi.js';
import { Constants } from './Constants';
import { PieceType, Color } from './Types';

export class AssetLoader {
  private static instance: AssetLoader;
  private assets: Map<string, PIXI.Texture>;
  private loadingPromise: Promise<void> | null;
  
  private constructor() {
    this.assets = new Map();
    this.loadingPromise = null;
  }
  
  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }
  
  public async loadAssets(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    this.loadingPromise = (async () => {
      try {
        // Create fallback textures for pieces
        this.createFallbackTextures();
        
        // Define assets to load
        const assets = {
          board_background: 'assets/images/board_background.png',
          highlight: 'assets/images/highlight.png',
          capture_highlight: 'assets/images/capture_highlight.png'
        };
        
        // Load all assets
        const loadedAssets = await PIXI.Assets.load(assets);
        
        // Store loaded textures
        Object.entries(loadedAssets).forEach(([key, resource]) => {
          if (resource instanceof PIXI.Texture) {
            this.assets.set(key, resource);
          }
        });
      } catch (error) {
        console.warn('Error loading assets, using fallback graphics:', error);
      }
    })();
    
    return this.loadingPromise;
  }
  
  private createFallbackTextures(): void {
    // Create fallback textures for each piece type and color
    const pieceTypes = Object.values(PieceType);
    const colors = Object.values(Color);
    
    for (const type of pieceTypes) {
      for (const color of colors) {
        const key = `${color}_${type}`;
        const texture = this.createFallbackPieceTexture(type, color);
        this.assets.set(key, texture);
      }
    }
  }
  
  private createFallbackPieceTexture(type: PieceType, color: Color): PIXI.Texture {
    const graphics = new PIXI.Graphics();
    const size = Constants.SQUARE_SIZE * 0.7;
    const margin = (Constants.SQUARE_SIZE - size) / 2;
    
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
  
  public getTexture(key: string): PIXI.Texture {
    const texture = this.assets.get(key);
    if (!texture) {
      throw new Error(`Texture not found: ${key}`);
    }
    return texture;
  }
  
  public createSprite(key: string): PIXI.Sprite {
    const texture = this.getTexture(key);
    return new PIXI.Sprite(texture);
  }
  
  public createPieceSprite(pieceType: string, color: string): PIXI.Sprite {
    const key = `${color}_${pieceType}`;
    return this.createSprite(key);
  }
} 