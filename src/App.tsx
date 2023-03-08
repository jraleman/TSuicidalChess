import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function App() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">3D Anti-Chess</h1>
        
        {/* Game container */}
        <div className="w-full aspect-square max-w-4xl mx-auto rounded-lg overflow-hidden">
          <Canvas
            camera={{ position: [0, 5, 8], fov: 50 }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              
              {/* Game components will be added here */}
              
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

        {/* Score and controls will be added here */}
      </div>
    </div>
  );
}

export default App;
