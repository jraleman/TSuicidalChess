import { useGameStore } from '../../context/gameStore';
import { hasForcedCapture } from '../../utils/movementValidation';
import { PieceColor } from '../../models/types';

export const StatusBar = () => {
  const { currentTurn, gameOver, winner, board, scores, gameMode, playerColor } = useGameStore();

  const getStatusMessage = () => {
    if (gameOver && winner) {
      return `${winner === 'white' ? 'White' : 'Black'} Wins!`;
    }
    
    if (gameMode === 'multiplayer') {
      if (currentTurn === playerColor) {
        return "Your Turn";
      } else {
        return "Opponent's Turn";
      }
    }
    
    return `${currentTurn === 'white' ? 'White' : 'Black'}'s Turn`;
  };

  const hasForced = hasForcedCapture(board, currentTurn);

  // Calculate remaining pieces for each player
  const getRemainingPieces = (color: PieceColor) => {
    return board.flat().filter(piece => piece?.color === color).length;
  };

  const whitePieces = getRemainingPieces('white');
  const blackPieces = getRemainingPieces('black');

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:right-auto sm:w-auto sm:transform sm:-translate-x-1/2">
      <div className="bg-gray-800/90 backdrop-blur-sm text-white px-4 py-3 sm:px-6 sm:py-3 rounded-t-xl sm:rounded-lg shadow-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Current Turn Indicator */}
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${currentTurn === 'white' ? 'bg-white' : 'bg-gray-800 border-2 border-white'}`} />
            <span className="font-medium text-base sm:text-lg">{getStatusMessage()}</span>
          </div>

          {/* Score Display */}
          <div className="flex items-center space-x-6 border-t sm:border-t-0 sm:border-l border-gray-600 pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-white" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-400">White</span>
                <span className="text-base sm:text-lg font-semibold">{scores.white}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-gray-800 border-2 border-white" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-400">Black</span>
                <span className="text-base sm:text-lg font-semibold">{scores.black}</span>
              </div>
            </div>
          </div>

          {/* Remaining Pieces */}
          <div className="flex items-center space-x-6 border-t sm:border-t-0 sm:border-l border-gray-600 pt-4 sm:pt-0 sm:pl-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-white" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-400">Pieces</span>
                <span className="text-base sm:text-lg font-semibold">{whitePieces}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-gray-800 border-2 border-white" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-400">Pieces</span>
                <span className="text-base sm:text-lg font-semibold">{blackPieces}</span>
              </div>
            </div>
          </div>

          {/* Forced Capture Warning */}
          {hasForced && !gameOver && (
            <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-gray-600 pt-4 sm:pt-0 sm:pl-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-base sm:text-lg font-medium text-yellow-400">Forced Capture!</span>
            </div>
          )}

          {/* Game Progress */}
          {!gameOver && (
            <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-gray-600 pt-4 sm:pt-0 sm:pl-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-400">Progress</span>
                <span className="text-base sm:text-lg font-semibold text-blue-400">
                  {Math.round((whitePieces + blackPieces) / 32 * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 