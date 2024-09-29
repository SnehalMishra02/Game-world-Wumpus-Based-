// pages/index.tsx
import { useState, useEffect } from 'react';
import Grid from '../components/Grid';

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

const checkForHazards = (position: { x: number; y: number }, grid: any[][]) => {
  const { x, y } = position;
  if (grid[x][y] === 'PIT') {
    alert('Game Over! You fell into a pit.');
    // Optional: Reset game or prevent further movement
  } else if (grid[x][y] === 'ENEMY') {
    alert('Game Over! You were destroyed by a rogue bot.');
    // Optional: Reset game or prevent further movement
  }
};

export default function Home() {
  const [grid, setGrid] = useState(generateGrid(5));
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let updatedGrid = [...grid];
    updatedGrid = placeEntities(updatedGrid, 'PIT', 3);
    updatedGrid = placeEntities(updatedGrid, 'ENEMY', 2);
    setGrid(updatedGrid);
  }, []);

  const movePlayer = (direction: string) => {
    let { x, y } = playerPosition;
    if (direction === 'up' && x > 0) x--;
    if (direction === 'down' && x < grid.length - 1) x++;
    if (direction === 'left' && y > 0) y--;
    if (direction === 'right' && y < grid[0].length - 1) y++;

    setPlayerPosition({ x, y });
    checkForHazards({ x, y }, grid); // Hazard check after moving
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Robot Wars: Wumpus Factory</h1>
      <Grid grid={grid} playerPosition={playerPosition} />
      
      {/* Game Control Buttons */}
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
      </div>
    </div>
  );
}
