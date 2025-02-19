import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { drawSpaceship, drawAsteroid } from '../utils/drawing';
import { checkCollision } from '../utils/collision';

interface GameProps {
  onGameOver: (time: number) => void;
}

interface Spaceship {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  rotation: number;
  targetRotation: number;
}

interface Asteroid {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

interface Timer {
  elapsedTime: number;
}

export function Game({ onGameOver }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spaceship, setSpaceship] = useState<Spaceship>({
    x: 400,
    y: 300,
    width: 30,
    height: 30,
    speed: 5,
    rotation: 0,
    targetRotation: 0,
  });
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [timer, setTimer] = useState<Timer>({ elapsedTime: 0 });
  const startTime = useRef(Date.now());

  const spawnAsteroid = () => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y, dx, dy;
    const speed = 2 + Math.random() * 3; // Increased speed range

    switch (side) {
      case 0: // top
        x = Math.random() * 800;
        y = -20;
        dx = (Math.random() - 0.5) * speed * 2; // More random trajectories
        dy = speed;
        break;
      case 1: // right
        x = 820;
        y = Math.random() * 600;
        dx = -speed;
        dy = (Math.random() - 0.5) * speed * 2;
        break;
      case 2: // bottom
        x = Math.random() * 800;
        y = 620;
        dx = (Math.random() - 0.5) * speed * 2;
        dy = -speed;
        break;
      default: // left
        x = -20;
        y = Math.random() * 600;
        dx = speed;
        dy = (Math.random() - 0.5) * speed * 2;
    }

    return {
      x,
      y,
      radius: 10 + Math.random() * 10, // Variable size asteroids
      dx,
      dy,
    };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateGame = () => {
    if (!canvasRef.current) return;

    // Update spaceship position and rotation
    const newSpaceship = { ...spaceship };
    let targetRotation = spaceship.rotation;

    if (keys['arrowleft'] || keys['a']) {
      newSpaceship.x -= spaceship.speed;
      targetRotation = -Math.PI / 2; // Swapped: now points left
    }
    if (keys['arrowright'] || keys['d']) {
      newSpaceship.x += spaceship.speed;
      targetRotation = Math.PI / 2; // Swapped: now points right
    }
    if (keys['arrowup'] || keys['w']) {
      newSpaceship.y -= spaceship.speed;
      targetRotation = 0; // Points up
    }
    if (keys['arrowdown'] || keys['s']) {
      newSpaceship.y += spaceship.speed;
      targetRotation = Math.PI; // Points down
    }

    // Diagonal movement
    if ((keys['arrowup'] || keys['w']) && (keys['arrowleft'] || keys['a'])) {
      targetRotation = -Math.PI / 4; // Swapped: up-left
    }
    if ((keys['arrowup'] || keys['w']) && (keys['arrowright'] || keys['d'])) {
      targetRotation = Math.PI / 4; // Swapped: up-right
    }
    if ((keys['arrowdown'] || keys['s']) && (keys['arrowleft'] || keys['a'])) {
      targetRotation = -3 * Math.PI / 4; // Swapped: down-left
    }
    if ((keys['arrowdown'] || keys['s']) && (keys['arrowright'] || keys['d'])) {
      targetRotation = 3 * Math.PI / 4; // Swapped: down-right
    }

    // Smooth rotation
    const rotationSpeed = 0.3;
    let rotationDiff = targetRotation - newSpaceship.rotation;

    // Ensure we rotate the shortest direction
    if (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    if (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

    newSpaceship.rotation += rotationDiff * rotationSpeed;

    // Keep spaceship in bounds
    newSpaceship.x = Math.max(0, Math.min(770, newSpaceship.x));
    newSpaceship.y = Math.max(0, Math.min(570, newSpaceship.y));

    setSpaceship(newSpaceship);

    // Update asteroids
    const newAsteroids = asteroids
      .map((asteroid) => ({
        ...asteroid,
        x: asteroid.x + asteroid.dx,
        y: asteroid.y + asteroid.dy,
      }))
      .filter((asteroid) =>
        asteroid.x > -50 &&
        asteroid.x < 850 &&
        asteroid.y > -50 &&
        asteroid.y < 650
      );

    // Spawn new asteroids more frequently
    if (Math.random() < 0.08) { // Increased spawn rate
      newAsteroids.push(spawnAsteroid());
    }

    // Spawn multiple asteroids at once occasionally
    if (Math.random() < 0.02) {
      for (let i = 0; i < 3; i++) {
        newAsteroids.push(spawnAsteroid());
      }
    }

    setAsteroids(newAsteroids);

    // Check for collisions
    for (const asteroid of newAsteroids) {
      if (checkCollision(spaceship, asteroid)) {
        onGameOver(Date.now() - startTime.current);
        return;
      }
    }

    setTimer(prev => ({ elapsedTime: Date.now() - startTime.current }));

    // Draw everything
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 600);

    // Draw timer
    ctx.font = '24px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const seconds = (timer.elapsedTime / 1000).toFixed(1);
    ctx.fillText(`${seconds}s`, 400, 30);

    drawSpaceship(ctx, spaceship);
    newAsteroids.forEach((asteroid) => drawAsteroid(ctx, asteroid));
  };

  useGameLoop(updateGame);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border-2 border-blue-500 bg-black rounded-lg"
    />
  );
}
