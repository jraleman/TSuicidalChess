import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { ChessBoard } from './components/board/ChessBoard';
import { ChessPieces } from './components/pieces/ChessPieces';
import { SoundToggle } from './components/ui/SoundToggle';
import { StatusBar } from './components/ui/StatusBar';
import { GameOverModal } from './components/ui/GameOverModal';
import { GameModeSelection } from './components/ui/GameModeSelection';
import { LeaveRoom } from './components/ui/LeaveRoom';
import { ColorSelection } from './components/ui/ColorSelection';
import { useGameStore } from './context/gameStore';
import { RoomSelection } from './components/ui/RoomSelection';
function App() {
  const { gameMode, playerColor, roomCode } = useGameStore();

  // Show game mode selection if no mode is selected
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <GameModeSelection />
      </div>
    );
  }

  // Show room selection if in multiplayer mode but no room is selected
  if (gameMode === 'multiplayer' && !roomCode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <RoomSelection />
      </div>
    );
  }

  // Show color selection if multiplayer mode is selected but no color is chosen
  if (!playerColor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <ColorSelection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">TSuicidalChess ♟♟️</h1>
              {gameMode === 'multiplayer' && roomCode && (
                <div className="bg-gray-700 px-3 py-1 rounded-lg flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span className="font-mono text-lg">{roomCode}</span>
                </div>
              )}
            </div>
            <SoundToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game container */}
        <div className="w-full aspect-square max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-gray-800">
          <Canvas
            camera={{ position: [0, 5, playerColor === 'white' ? -10 : 10], fov: 60 }}
            className="w-full h-full"
            shadows
            >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
              />
              
              <ChessBoard />
              <ChessPieces />
              <Environment preset="sunset" />
              
              <OrbitControls
                enablePan={false}
                enableRotate={false}
                minDistance={10}
                maxDistance={15}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2.5}
                minZoom={1}
                maxZoom={1}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Status Bar */}
        <StatusBar />
      </main>

      {/* Game Over Modal */}
      <GameOverModal />

      {/* Leave Room Button (only in multiplayer mode) */}
      {gameMode === 'multiplayer' && <LeaveRoom />}
    </div>
  );
}

export default App;
