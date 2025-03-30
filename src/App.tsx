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
import { useGameStore } from './context/gameStore';

function App() {
  const { gameMode, playerColor } = useGameStore();

  // Show game mode selection if no mode is selected
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <GameModeSelection />
      </div>
    );
  }

  // Show color selection if multiplayer mode is selected but no color is chosen
  if (gameMode === 'multiplayer' && !playerColor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <GameModeSelection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">TSuicidalChess ♟♟️</h1>
            <SoundToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game container */}
        <div className="w-full aspect-square max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-gray-800">
          <Canvas
            camera={{ position: [0, 5, 8], fov: 50 }}
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
                minDistance={5}
                maxDistance={15}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
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
