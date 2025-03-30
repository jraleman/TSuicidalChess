import { useGameStore } from '../../context/gameStore';
import { hasForcedCapture } from '../../utils/movementValidation';
import { PieceColor } from '../../models/types';
import { AIConfig } from './AIConfig';

export const StatusBar = () => {
  const { currentTurn, gameOver, winner, board, scores, gameMode, playerColor, aiMode } = useGameStore();

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
    
    if (aiMode) {
      if (currentTurn === playerColor) {
        return "Your Turn";
      } else {
        return "AI is thinking...";
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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <span className="font-bold">White: </span>
            {scores.white} / 16 
            <span className="mr-10"></span>
            <span className="font-bold">Black: </span>
            {scores.black} / 16
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">{getStatusMessage()}</div>
          {hasForced && <div className="text-yellow-500">Forced Capture!</div>}
        </div>
      </div>
      <AIConfig />
    </div>
  );
}; 