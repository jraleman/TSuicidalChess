/**
 * MoveValidator for Anti-Chess
 * 
 * Responsibilities:
 * - Validates moves according to Anti-Chess rules
 * - Checks if captures are mandatory
 * - Implements piece-specific movement rules
 * - Handles special cases like pawn promotion
 */

import { Piece } from '@/entities/Piece';
import { Square } from '@/entities/Square';
import { Board } from '@/entities/Board';
import { PieceType, Color } from './Types';
import { Constants } from './Constants';

export class MoveValidator {
  private board: Board;
  
  constructor(board: Board) {
    this.board = board;
  }
  
  public validateMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Check if destination is within board bounds
    if (toX < 0 || toX >= Constants.BOARD_SIZE || toY < 0 || toY >= Constants.BOARD_SIZE) {
      return false;
    }
    
    // Check if destination has a piece of the same color
    const targetPiece = this.board.getPieceAt(toX, toY);
    if (targetPiece && targetPiece.getColor() === piece.getColor()) {
      return false;
    }
    
    // Delegate to piece-specific validation
    const pieceType = piece.getType();
    
    switch (pieceType) {
      case PieceType.PAWN:
        return this.isValidPawnMove(piece, fromX, fromY, toX, toY);
      case PieceType.ROOK:
        return this.isValidRookMove(piece, fromX, fromY, toX, toY);
      case PieceType.KNIGHT:
        return this.isValidKnightMove(piece, fromX, fromY, toX, toY);
      case PieceType.BISHOP:
        return this.isValidBishopMove(piece, fromX, fromY, toX, toY);
      case PieceType.QUEEN:
        return this.isValidQueenMove(piece, fromX, fromY, toX, toY);
      case PieceType.KING:
        return this.isValidKingMove(piece, fromX, fromY, toX, toY);
      default:
        return false;
    }
  }
  
  public hasForcedCapture(color: Color): boolean {
    // In Anti-Chess, if a capture is possible, it's mandatory
    // Check if any piece of the given color can capture
    
    // For this simplified implementation, we'll just check if there's at least one piece
    // that can make a capture move
    for (let y = 0; y < Constants.BOARD_SIZE; y++) {
      for (let x = 0; x < Constants.BOARD_SIZE; x++) {
        const piece = this.board.getPieceAt(x, y);
        
        if (piece && piece.getColor() === color) {
          // Check if this piece can capture anything
          for (let ty = 0; ty < Constants.BOARD_SIZE; ty++) {
            for (let tx = 0; tx < Constants.BOARD_SIZE; tx++) {
              const targetPiece = this.board.getPieceAt(tx, ty);
              
              // If there's an opponent's piece and the move is valid
              if (targetPiece && targetPiece.getColor() !== color && 
                  this.validateMove(piece, x, y, tx, ty)) {
                return true;
              }
            }
          }
        }
      }
    }
    
    return false;
  }
  
  public getForcedCaptureMoves(color: Color): Array<{ piece: Piece, moves: Square[] }> {
    const result: Array<{ piece: Piece, moves: Square[] }> = [];
    
    // Check each piece of the given color
    for (let y = 0; y < Constants.BOARD_SIZE; y++) {
      for (let x = 0; x < Constants.BOARD_SIZE; x++) {
        const piece = this.board.getPieceAt(x, y);
        
        if (piece && piece.getColor() === color) {
          const captureMoves: Square[] = [];
          
          // Check each potential target
          for (let ty = 0; ty < Constants.BOARD_SIZE; ty++) {
            for (let tx = 0; tx < Constants.BOARD_SIZE; tx++) {
              const targetPiece = this.board.getPieceAt(tx, ty);
              
              // If there's an opponent's piece and the move is valid
              if (targetPiece && targetPiece.getColor() !== color && 
                  this.validateMove(piece, x, y, tx, ty)) {
                captureMoves.push(this.board.getSquares()[ty][tx]);
              }
            }
          }
          
          if (captureMoves.length > 0) {
            result.push({ piece, moves: captureMoves });
          }
        }
      }
    }
    
    return result;
  }
  
  public isPawnPromotion(piece: Piece, toY: number): boolean {
    // Check if a pawn move results in promotion (reaching the opposite end)
    if (piece.getType() !== PieceType.PAWN) {
      return false;
    }
    
    return (piece.getColor() === Color.WHITE && toY === 0) ||
           (piece.getColor() === Color.BLACK && toY === 7);
  }
  
  private isValidPawnMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    const color = piece.getColor();
    const direction = color === Color.WHITE ? -1 : 1; // White moves up (-y), Black moves down (+y)
    const startingRank = color === Color.WHITE ? 6 : 1;
    
    // Get the piece at the destination, if any
    const targetPiece = this.board.getPieceAt(toX, toY);
    const isCapture = targetPiece !== null;
    
    // Forward move (non-capturing)
    if (toX === fromX && !isCapture) {
      // Single square forward
      if (toY === fromY + direction) {
        return true;
      }
      
      // Double square forward from starting position
      if (fromY === startingRank && toY === fromY + 2 * direction) {
        // Check if the path is clear
        const middleY = fromY + direction;
        return this.board.getPieceAt(fromX, middleY) === null;
      }
    }
    
    // Diagonal capture
    if (Math.abs(toX - fromX) === 1 && toY === fromY + direction && isCapture) {
      return true;
    }
    
    // En passant is not implemented in this simplified version
    
    return false;
  }
  
  private isValidRookMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Rooks move in straight lines (horizontal or vertical)
    if (fromX !== toX && fromY !== toY) {
      return false;
    }
    
    // Check if the path is clear
    return this.isPathClear(fromX, fromY, toX, toY);
  }
  
  private isValidKnightMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Knights move in an L shape: 2 squares in one direction, then 1 square perpendicular
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    
    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }
  
  private isValidBishopMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Bishops move diagonally
    if (Math.abs(toX - fromX) !== Math.abs(toY - fromY)) {
      return false;
    }
    
    // Check if the path is clear
    return this.isPathClear(fromX, fromY, toX, toY);
  }
  
  private isValidQueenMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Queens can move like rooks or bishops
    // Check for straight moves
    if (fromX === toX || fromY === toY) {
      return this.isValidRookMove(piece, fromX, fromY, toX, toY);
    }
    
    // Check for diagonal moves
    if (Math.abs(toX - fromX) === Math.abs(toY - fromY)) {
      return this.isValidBishopMove(piece, fromX, fromY, toX, toY);
    }
    
    return false;
  }
  
  private isValidKingMove(piece: Piece, fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Kings move one square in any direction
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    
    // In Anti-Chess, there's no concept of check, so kings move freely
    return dx <= 1 && dy <= 1 && (dx > 0 || dy > 0);
  }
  
  private isPathClear(fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Determine the direction of movement
    const dx = Math.sign(toX - fromX);
    const dy = Math.sign(toY - fromY);
    
    // Start from the origin and move one step at a time
    let x = fromX + dx;
    let y = fromY + dy;
    
    // Check each square along the path (excluding the destination)
    while (x !== toX || y !== toY) {
      if (this.board.getPieceAt(x, y) !== null) {
        return false; // Path is blocked
      }
      
      x += dx;
      y += dy;
    }
    
    return true; // Path is clear
  }
} 