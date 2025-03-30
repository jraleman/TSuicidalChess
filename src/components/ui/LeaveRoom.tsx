import { useGameStore } from '../../context/gameStore';
import { roomService } from '../../services/roomService';

export const LeaveRoom = () => {
  const { roomCode, setGameMode, initializeGame } = useGameStore();

  const handleLeaveRoom = () => {
    if (roomCode) {
      const playerId = localStorage.getItem('playerId');
      if (playerId) {
        roomService.leaveRoom(roomCode, playerId);
        localStorage.removeItem('playerId');
      }
    }
    setGameMode(null);
    initializeGame();
  };

  return (
    <button
      onClick={handleLeaveRoom}
      className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span>Leave Room</span>
    </button>
  );
}; 