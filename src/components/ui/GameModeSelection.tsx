import { useGameStore } from '../../context/gameStore';
import { GameMode } from '../../models/types';
import { RoomSelection } from './RoomSelection';

export const GameModeSelection = () => {
  const { gameMode, setGameMode } = useGameStore();

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
  };

  // Show room selection if multiplayer mode is selected
  if (gameMode === 'multiplayer') {
    return <RoomSelection />;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Select Game Mode</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Single Player Mode */}
            <button
              onClick={() => handleModeSelect('single')}
              className={`bg-gray-700 hover:bg-gray-600 text-white font-semibold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 ${
                gameMode === 'single' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <span className="text-xl block">Single Player</span>
                <span className="text-sm text-gray-400">Play against yourself</span>
              </div>
            </button>

            {/* Multiplayer Mode */}
            <button
              onClick={() => handleModeSelect('multiplayer')}
              className={`bg-gray-700 hover:bg-gray-600 text-white font-semibold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105 ${
                gameMode === 'multiplayer' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <div className="text-left">
                <span className="text-xl block">Multiplayer</span>
                <span className="text-sm text-gray-400">Play with a friend</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 