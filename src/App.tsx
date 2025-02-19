import React, { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { Game } from './components/Game';

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGameOver = (time: number) => {
    setGameOver(true);
    setSurvivalTime(time);
    setIsPlaying(false);
  };

  const startGame = () => {
    setGameOver(false);
    setSurvivalTime(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isPlaying) {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-2">
        <Rocket className="w-8 h-8" /> Space Survival
      </h1>

      {!isPlaying && (
        <div className="text-center mb-4">
          {gameOver && (
            <div className="text-xl text-red-400 mb-4">
              Game Over! You survived for {(survivalTime / 1000).toFixed(1)} seconds
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
            <span className="text-gray-400 text-sm">
              Press SPACE to {gameOver ? 'play again' : 'start'}
            </span>
          </div>
        </div>
      )}

      {isPlaying && (
        <div className="relative">
          <Game onGameOver={handleGameOver} />
          <div className="absolute bottom-4 left-4 text-white text-xl font-mono">
            Controls: Arrow keys or WASD
          </div>
        </div>
      )}
    </div>
  );
}

export default App;