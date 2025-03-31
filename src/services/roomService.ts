import { Room, GameState } from '../models/types';

class RoomService {
  private rooms: Map<string, Room> = new Map();

  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  createRoom(): Room {
    const code = this.generateRoomCode();
    const room: Room = {
      code,
      players: {},
      gameState: {
        board: Array(8).fill(null).map(() => Array(8).fill(null)),
        currentTurn: 'white',
        selectedPiece: null,
        possibleMoves: [],
        scores: { white: 0, black: 0 },
        gameOver: false,
        winner: null,
        gameMode: 'multiplayer-room',
        playerColor: null,
        roomCode: code,
        aiMode: false,
        aiDifficulty: 'easy',
        aiColor: null
      }
    };
    this.rooms.set(code, room);
    return room;
  }

  joinRoom(code: string, playerId: string): Room | null {
    const room = this.rooms.get(code);
    if (!room) return null;

    // Assign player to available color
    if (!room.players.white) {
      room.players.white = playerId;
    } else if (!room.players.black) {
      room.players.black = playerId;
    } else {
      return null; // Room is full
    }

    return room;
  }

  getRoom(code: string): Room | null {
    return this.rooms.get(code) || null;
  }

  updateRoomState(code: string, gameState: GameState): void {
    const room = this.rooms.get(code);
    if (room) {
      room.gameState = gameState;
    }
  }

  leaveRoom(code: string, playerId: string): void {
    const room = this.rooms.get(code);
    if (room) {
      if (room.players.white === playerId) {
        delete room.players.white;
      } else if (room.players.black === playerId) {
        delete room.players.black;
      }
      
      // If room is empty, delete it
      if (!room.players.white && !room.players.black) {
        this.rooms.delete(code);
      }
    }
  }
}

export const roomService = new RoomService(); 