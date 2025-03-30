import { useGameStore } from '../../context/gameStore';
import { PieceColor } from '../../models/types';

export const ColorSelection = () => {
  const { setPlayerColor, initializeGame } = useGameStore();

  const handleColorSelect = (color: PieceColor) => {
    setPlayerColor(color);
    initializeGame();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Choose Your Color</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* White Pieces */}
            <button
              onClick={() => handleColorSelect('white')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-white" />
                <div className="text-left">
                  <span className="text-xl block">White</span>
                  <span className="text-sm text-gray-400">Play as White</span>
                </div>
              </div>
            </button>

            {/* Black Pieces */}
            <button
              onClick={() => handleColorSelect('black')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-white" />
                <div className="text-left">
                  <span className="text-xl block">Black</span>
                  <span className="text-sm text-gray-400">Play as Black</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 