import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameInterface from '../components/GameInterface';
import { useSocket } from '../hooks/useSocket';

function GamePage() {
  const {
    gameState,
    playerColor,
    opponent,
    makeMove,
    startNewGame,
    isConnected,
    username,
    error,
    rejoinGame,
  } = useSocket();

  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedGameId = localStorage.getItem('connect4_gameId');
    const storedUsername = localStorage.getItem('connect4_username');

    if (storedGameId && storedUsername) {
      setTimeout(() => {
        rejoinGame();
      }, 1000);
    } else {
      navigate('/');
    }
  }, [rejoinGame, navigate]);

  if (!gameState) {
    return <p className="text-center mt-10">Loading game...</p>;
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
