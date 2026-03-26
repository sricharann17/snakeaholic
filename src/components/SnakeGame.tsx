import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF] w-full max-w-md">
      <div className="flex justify-between w-full items-center border-b-4 border-[#00FFFF] pb-2">
        <div className="text-[#00FFFF] font-mono text-xl uppercase">
          &gt; MEM.ALLOC: {score.toString().padStart(4, '0')}
        </div>
        <button 
          onClick={resetGame}
          className="px-2 py-1 bg-[#FF00FF] text-black font-mono uppercase hover:bg-white hover:text-black transition-none"
        >
          [RST]
        </button>
      </div>

      <div 
        className="relative bg-black border-4 border-[#FF00FF] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 18, 
          height: GRID_SIZE * 18,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[1px] border-[#00FFFF]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div 
            key={i}
            className={`absolute ${i === 0 ? 'bg-white' : 'bg-[#00FFFF]'}`}
            style={{
              width: '18px',
              height: '18px',
              left: `${segment.x * 18}px`,
              top: `${segment.y * 18}px`,
            }}
          />
        ))}

        {/* Food */}
        <div 
          className="absolute bg-[#FF00FF] animate-pulse"
          style={{
            width: '18px',
            height: '18px',
            left: `${food.x * 18}px`,
            top: `${food.y * 18}px`,
          }}
        />

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 p-4 text-center">
            {gameOver ? (
              <div className="glitch-wrapper">
                <h2 className="text-2xl font-mono text-[#FF00FF] mb-4 glitch-text" data-text="FATAL_ERR">FATAL_ERR</h2>
                <p className="text-[#00FFFF] font-sans text-xl mb-6">&gt; COLLISION_DETECTED</p>
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 bg-[#00FFFF] text-black font-mono uppercase hover:bg-[#FF00FF] hover:text-white transition-none border-2 border-white"
                >
                  EXECUTE_RETRY
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-mono text-[#00FFFF] mb-4 animate-pulse">SYS.PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-4 py-2 bg-[#FF00FF] text-black font-mono uppercase hover:bg-[#00FFFF] hover:text-black transition-none border-2 border-white"
                >
                  INIT_SEQUENCE
                </button>
                <p className="mt-4 text-[#00FFFF] font-sans text-lg uppercase">&gt; PRESS_SPACE</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-[#FF00FF] text-lg font-sans uppercase w-full text-left border-t-4 border-[#00FFFF] pt-2">
        &gt; INPUT: ARROW_KEYS | SPACE
      </div>
    </div>
  );
};
