import React from 'react';
import { useGameStore } from '../../context/gameStore';

export const ColorSelection: React.FC = () => {
  const { setPlayerColor } = useGameStore();

  const handleColorSelect = (color: 'white' | 'black') => {
    setPlayerColor(color);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Choose Your Color</h2>
          <p className="text-gray-300 mb-8">Select which color you want to play as</p>
          
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => handleColorSelect('white')}
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <span className="text-xl block">White</span>
                <span className="text-sm text-gray-600">First to move</span>
              </div>
            </button>

            <button
              onClick={() => handleColorSelect('black')}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <span className="text-xl block">Black</span>
                <span className="text-sm text-gray-400">Second to move</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 