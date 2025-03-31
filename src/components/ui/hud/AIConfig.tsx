import { useGameStore } from '../../../context/gameStore';
import { DifficultyLevel } from '../../../services/aiService';

export const AIConfig = () => {
  const { aiMode, aiDifficulty, setAIMode, setAIDifficulty } = useGameStore();

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setAIDifficulty(difficulty);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="aiMode"
          checked={aiMode}
          onChange={(e) => setAIMode(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="aiMode" className="text-white">
          {aiMode ? 'AI Mode' : 'Playing in Free Mode'}
        </label>
        {aiMode && (
        <div className="flex flex-col gap-2 ml-auto">
          <label className="text-white">Difficulty:</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleDifficultyChange('easy')}
              className={`px-3 py-1 rounded ${
                aiDifficulty === 'easy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficultyChange('medium')}
              className={`px-3 py-1 rounded ${
                aiDifficulty === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => handleDifficultyChange('hard')}
              className={`px-3 py-1 rounded ${
                aiDifficulty === 'hard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Hard
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}; 