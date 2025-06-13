"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

type Position = {
  x: number;
  y: number;
};

export default function Home() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= CANVAS_SIZE / GRID_SIZE ||
        head.y < 0 ||
        head.y >= CANVAS_SIZE / GRID_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore((prev) => prev + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
          E-Study
        </h1>
        <p className="text-xl text-gray-300 mb-6">Play Snake while you wait!</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Dashboard →
        </Link>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white font-semibold">Score: {score}</div>
          {!gameStarted ? (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Game
            </button>
          ) : gameOver ? (
            <div className="flex gap-2 items-center">
              <span className="text-red-400 font-semibold">Game Over!</span>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="text-green-400 font-semibold">Playing...</div>
          )}
        </div>

        <div
          className="relative bg-gray-800 border-2 border-gray-700"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        >
          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              left: food.x * GRID_SIZE,
              top: food.y * GRID_SIZE,
              width: GRID_SIZE - 2,
              height: GRID_SIZE - 2,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute ${
                index === 0 ? "bg-green-400" : "bg-green-500"
              } rounded-sm`}
              style={{
                left: segment.x * GRID_SIZE,
                top: segment.y * GRID_SIZE,
                width: GRID_SIZE - 2,
                height: GRID_SIZE - 2,
              }}
            />
          ))}
        </div>

        <div className="mt-4 text-center text-gray-400 text-sm">
          Use arrow keys to control the snake
        </div>
      </div>
    </div>
  );
}
