
import React from 'react';

interface GridProps {
  grid: (string | null)[][];
  playerPosition: { x: number; y: number };
}

const Grid: React.FC<GridProps> = ({ grid, playerPosition }) => {
  return (
    <div className="grid grid-cols-5 gap-1">
      {grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          const isPlayer = playerPosition.x === rowIndex && playerPosition.y === colIndex;
          const cellColor = cell === 'GOAL' ? 'bg-yellow-500' : cell === 'PIT' ? 'bg-black' : cell === 'ENEMY' ? 'bg-red-400' : 'bg-gray-200';
          const borderColor = isPlayer ? 'border-blue-600' : 'border-gray-400';

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 border ${borderColor} ${cellColor} flex items-center justify-center`}
            >
              {isPlayer && <span className="text-white text-lg font-bold">🤖</span>}
              {cell === 'ENEMY' && <span className="text-red-600 text-xl">👹</span>}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Grid;
