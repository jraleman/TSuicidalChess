import { useGameStore } from '../../../context/gameStore';
import { PieceColor } from '../../../models/types';

export const GameOverModal = () => {
  const { gameOver, winner, scores, initializeGame } = useGameStore();

  if (!gameOver || !winner) return null;

  const getWinnerColor = (color: PieceColor) => {
    return color === 'white' ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700 transform transition-all">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Game Over!</h2>
          
          {/* Winner Display */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className={`w-6 h-6 rounded-full ${winner === 'white' ? 'bg-white' : 'bg-gray-800 border-2 border-white'}`} />
            <span className={`text-3xl font-bold ${getWinnerColor(winner)}`}>
              {winner === 'white' ? 'White' : 'Black'} Wins!
            </span>
          </div>

          {/* Final Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-4 h-4 rounded-full bg-white" />
                <span className="text-white font-medium text-lg">White</span>
              </div>
              <div className="text-4xl font-bold text-white">{scores.white}</div>
              <div className="text-sm text-gray-400 mt-1">points</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-white" />
                <span className="text-white font-medium text-lg">Black</span>
              </div>
              <div className="text-4xl font-bold text-white">{scores.black}</div>
              <div className="text-sm text-gray-400 mt-1">points</div>
            </div>
          </div>

          {/* Restart Button */}
          <button
            onClick={initializeGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 mx-auto transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 