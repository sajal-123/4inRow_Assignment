import React from 'react';
import { Circle } from 'lucide-react';

interface GameBoardProps {
  board: (string | null)[][];
  onColumnClick: (column: number) => void;
  currentPlayer: string;
  playerColor: string;
  isMyTurn: boolean;
  gameEnded: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onColumnClick,
  currentPlayer,
  playerColor,
  isMyTurn,
  gameEnded
}) => {
  const handleColumnClick = (column: number) => {
    if (!isMyTurn || gameEnded) return;
    
    // Check if column is full
    if (board[0][column] !== null) return;
    
    onColumnClick(column);
  };

  return (
    <div className="bg-blue-600 p-6 rounded-xl shadow-2xl">
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 7 }, (_, col) => (
          <div key={col} className="flex flex-col gap-3">
            {/* Column header for clicking */}
            <div
              className={`
                w-16 h-8 rounded-t-lg flex items-center justify-center text-white font-bold
                ${!isMyTurn || gameEnded ? 'cursor-not-allowed bg-blue-700' : 'cursor-pointer bg-blue-500 hover:bg-blue-400 transition-colors'}
              `}
              onClick={() => handleColumnClick(col)}
            >
              {!gameEnded && isMyTurn && board[0][col] === null && '↓'}
            </div>
            
            {/* Game cells */}
            {Array.from({ length: 6 }, (_, row) => (
              <div
                key={`${row}-${col}`}
                className="w-16 h-16 rounded-full border-4 border-blue-800 bg-white flex items-center justify-center shadow-inner"
              >
                {board[row][col] && (
                  <Circle
                    className={`w-12 h-12 ${
                      board[row][col] === 'red' 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-yellow-400 fill-yellow-400'
                    } drop-shadow-lg`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        {!gameEnded && (
          <div className="flex items-center justify-center gap-3 bg-white rounded-lg p-3">
            <Circle
              className={`w-8 h-8 ${
                isMyTurn ? 
                  (playerColor === 'red' ? 'text-red-500 fill-red-500' : 'text-yellow-400 fill-yellow-400') :
                  (playerColor === 'red' ? 'text-yellow-400 fill-yellow-400' : 'text-red-500 fill-red-500')
              }`}
            />
            <span className="text-gray-800 font-bold text-lg">
              {isMyTurn ? "Your Turn" : `${currentPlayer}'s Turn`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;