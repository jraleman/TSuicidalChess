import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MeshStandardMaterial } from 'three';
import { Position } from '../models/types';

interface AnimationState {
  isAnimating: boolean;
  startPosition: Position;
  endPosition: Position;
  isCapture?: boolean;
}

export const usePieceAnimation = () => {
  const groupRef = useRef<Group>(null);
  const progressRef = useRef(0);
  const animationStateRef = useRef<AnimationState>({
    isAnimating: false,
    startPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 },
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = (from: Position, to: Position, isCapture: boolean = false) => {
    progressRef.current = 0;
    animationStateRef.current = {
      isAnimating: true,
      startPosition: from,
      endPosition: to,
      isCapture,
    };
    setIsAnimating(true);
  };

  useFrame((_, delta) => {
    if (!animationStateRef.current.isAnimating) return;

    progressRef.current = Math.min(progressRef.current + delta * 2, 1);
    
    if (groupRef.current) {
      // Calculate current position
      const currentX = animationStateRef.current.startPosition.x + 
        (animationStateRef.current.endPosition.x - animationStateRef.current.startPosition.x) * progressRef.current;
      const currentY = animationStateRef.current.startPosition.y + 
        (animationStateRef.current.endPosition.y - animationStateRef.current.startPosition.y) * progressRef.current;

      // Apply position with offset for board centering
      groupRef.current.position.x = currentX - 3.5;
      groupRef.current.position.z = currentY - 3.5;

      if (animationStateRef.current.isCapture) {
        // For captures, scale down and fade out
        const scale = 1 - progressRef.current;
        groupRef.current.scale.set(scale, scale, scale);
        groupRef.current.children.forEach(child => {
          if ('material' in child) {
            const material = child.material as MeshStandardMaterial;
            material.opacity = 1 - progressRef.current;
            material.transparent = true;
          }
        });
      } else {
        // Normal movement with lift effect
        groupRef.current.position.y = 0.2 + Math.sin(progressRef.current * Math.PI) * 0.3;
      }
    }

    if (progressRef.current === 1) {
      animationStateRef.current.isAnimating = false;
      setIsAnimating(false);
    }
  });

  return {
    groupRef,
    startAnimation,
    isAnimating,
  };
}; 