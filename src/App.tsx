import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { ChessBoard } from './components/board/ChessBoard';
import { ChessPieces } from './components/pieces/ChessPieces';
import { SoundToggle } from './components/ui/hud/SoundToggle';
import { StatusBar } from './components/ui/hud/StatusBar';
import { GameOverModal } from './components/ui/modal/GameOverModal';
import { GameModeSelection } from './components/ui/modal/GameModeSelection';
import { LeaveRoom } from './components/ui/hud/LeaveRoom';
import { ColorSelection } from './components/ui/modal/ColorSelection';
import { RoomSelection } from './components/ui/modal/RoomSelection';
import { useGameStore } from './context/gameStore';

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
  if ((!roomCode && gameMode === 'multiplayer-room')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <RoomSelection />
      </div>
    );
  }

  // Show color selection if multiplayer mode is selected but no color is chosen
  if (!playerColor && gameMode === 'single') {
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
              <h1 className="text-2xl font-bold text-white">TTTSuicidalChess ♟♟️</h1>
              {gameMode === 'multiplayer-room' && roomCode && (
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
            camera={{ 
              fov: 60,
              position: [
                0,
                gameMode === 'multiplayer-local' ? 25 : 5,
                playerColor === 'white' || gameMode === 'multiplayer-local' ? -10 : 10
              ],
              zoom: 1
            }}
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
                enableZoom
                enableDamping
                enablePan={false}
                enableRotate={false}
                minDistance={5}
                maxDistance={25}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                minZoom={1}
                maxZoom={5}
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
      {gameMode === 'multiplayer-room' && <LeaveRoom />}
    </div>
  );
}

export default App;
