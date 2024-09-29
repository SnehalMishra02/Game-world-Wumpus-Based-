'use client'
import { useState, useEffect } from 'react';
import Grid from './components/Grid';

const generateGrid = (size: number) => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
};

const placeEntities = (grid: any[][], entity: string, num: number) => {
  let count = 0;
  while (count < num) {
    const x = Math.floor(Math.random() * grid.length);
    const y = Math.floor(Math.random() * grid[0].length);

    if (!grid[x][y]) {
      grid[x][y] = entity;
      count++;
    }
  }
  return grid;
};

const placeGoal = (grid: any[][]) => {
  // Place the goal at a random empty cell
  let placed = false;
  while (!placed) {
    const x = Math.floor(Math.random() * grid.length);
    const y = Math.floor(Math.random() * grid[0].length);

    if (!grid[x][y]) {
      grid[x][y] = 'GOAL';
      placed = true;
    }
  }
  return grid;
};

const checkForHazards = (position: { x: number; y: number }, grid: any[][], setGameOver: (gameOver: boolean) => void, setWin: (win: boolean) => void) => {
  const { x, y } = position;
  if (grid[x][y] === 'PIT') {
    alert('Game Over! You fell into a pit.');
    setGameOver(true);
  } else if (grid[x][y] === 'ENEMY') {
    alert('Game Over! You were destroyed by a rogue bot.');
    setGameOver(true);
  } else if (grid[x][y] === 'GOAL') {
    alert('Congratulations! You reached the goal.');
    setWin(true);
  }
};

const shoot = (direction: string, playerPosition: { x: number; y: number }, grid: any[][], setGrid: (grid: any[][]) => void) => {
  let { x, y } = playerPosition;
  let hit = false;

  while (true) {
    if (direction === 'up') x--;
    if (direction === 'down') x++;
    if (direction === 'left') y--;
    if (direction === 'right') y++;

    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) break;

    if (grid[x][y] === 'ENEMY') {
      grid[x][y] = null; // Destroy the enemy
      setGrid([...grid]);
      hit = true;
      break;
    }
  }

  if (!hit) {
    alert('No enemy in line of fire!');
  }
};

const resetGame = (size: number, setGrid: (grid: any[][]) => void, setPlayerPosition: (pos: { x: number; y: number }) => void, setGameOver: (gameOver: boolean) => void, setWin: (win: boolean) => void) => {
  const newGrid = generateGrid(size);
  const gridWithEntities = placeEntities(newGrid, 'PIT', 3);
  const gridWithEnemies = placeEntities(gridWithEntities, 'ENEMY', 2);
  const finalGrid = placeGoal(gridWithEnemies);
  setGrid(finalGrid);
  setPlayerPosition({ x: 0, y: 0 });
  setGameOver(false);
  setWin(false);
};

export default function Home() {
  const [grid, setGrid] = useState(generateGrid(5));
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    resetGame(5, setGrid, setPlayerPosition, setGameOver, setWin);
  }, []);

  useEffect(() => {
    if (win) {
      resetGame(5, setGrid, setPlayerPosition, setGameOver, setWin);
    }
  }, [win]);

  const movePlayer = (direction: string) => {
    if (gameOver || win) return; // Prevent movement if game is over or won

    let { x, y } = playerPosition;
    if (direction === 'up' && x > 0) x--;
    if (direction === 'down' && x < grid.length - 1) x++;
    if (direction === 'left' && y > 0) y--;
    if (direction === 'right' && y < grid[0].length - 1) y++;

    const newPosition = { x, y };
    setPlayerPosition(newPosition);

    checkForHazards(newPosition, grid, setGameOver, setWin);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-blue-300">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Demon Assault</h1>
        <p className="text-lg mb-4">
          <strong>How to Play:</strong><br />
          - Use the given buttons to move your robot.<br />
          - Shoot in the direction to destroy enemies.<br />
          - Avoid <span className='bg-green-400 text-black font-extrabold'>black blocks (pits)</span> and <span className='bg-teal-300 text-red-400 font-extrabold'>Demons (enemies)</span>.<br />
          - Click "New Map" to generate a new grid.<br />
          - Reach the <span className='text-yellow-400 bg-slate-500 font-extrabold'>yellow block (goal)</span> to win the game!
        </p>
      </div>
      <Grid grid={grid} playerPosition={playerPosition} />
      
      <div className="flex space-x-4 mt-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
          onClick={() => movePlayer('up')}
        >
          Up
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
          onClick={() => movePlayer('left')}
        >
          Left
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
          onClick={() => movePlayer('right')}
        >
          Right
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300"
          onClick={() => movePlayer('down')}
        >
          Down
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300"
          onClick={() => shoot('up', playerPosition, grid, setGrid)}
        >
          Shoot Up
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300"
          onClick={() => shoot('down', playerPosition, grid, setGrid)}
        >
          Shoot Down
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300"
          onClick={() => shoot('left', playerPosition, grid, setGrid)}
        >
          Shoot Left
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300"
          onClick={() => shoot('right', playerPosition, grid, setGrid)}
        >
          Shoot Right
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-300"
          onClick={() => resetGame(5, setGrid, setPlayerPosition, setGameOver, setWin)}
        >
          New Map
        </button>
      </div>
    </div>
  );
}
