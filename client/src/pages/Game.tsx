import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameInterface from '../components/GameInterface';

interface GamePageProps {
  gameState: any;
  playerColor: string;
  opponent: string;
  makeMove: (column: number) => void;
  startNewGame: () => void;
  isConnected: boolean;
  username: string;
  error: string | null;
  rejoinGame: () => void;
}

const GamePage: React.FC<GamePageProps> = ({
  gameState,
  playerColor,
  opponent,
  makeMove,
  startNewGame,
  isConnected,
  username,
  error,
  rejoinGame,
}) => {

  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedGameId = localStorage.getItem('connect4_gameId');
    const storedUsername = localStorage.getItem('connect4_username');
    if(!storedUsername) {
      // If no username is stored, redirect to home
      navigate('/');
      return;
    }

    if (storedGameId && storedUsername) {
      setTimeout(() => {
        rejoinGame();
      }, 1000);
    }
  }, [rejoinGame, navigate]);

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Setting up your game...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please wait while we load the game board.
        </p>
      </div>
    );
  }


  return (
    <div className="relative">
      <GameInterface
        gameState={gameState}
        playerColor={playerColor}
        opponent={opponent}
        onMove={makeMove}
        onNewGame={startNewGame}
        isConnected={isConnected}
        username={username}
      />
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

export default GamePage;
