import React, { useEffect } from 'react';
import GameLobby from './components/GameLobby';
import GameInterface from './components/GameInterface';
import { useSocket } from './hooks/useSocket';

function App() {
  const {
    isConnected,
    gameState,
    playerColor,
    opponent,
    isWaiting,
    gameEnded,
    error,
    username,
    joinGame,
    makeMove,
    rejoinGame,
    startNewGame
  } = useSocket();

  useEffect(() => {
    // Try to rejoin existing game on page load
    const gameId = localStorage.getItem('connect4_gameId');
    const storedUsername = localStorage.getItem('connect4_username');
    
    if (gameId && storedUsername) {
      setTimeout(() => {
        rejoinGame();
      }, 1000); // Give socket time to connect
    }
  }, [rejoinGame]);

  if (!gameState) {
    return (
      <div className="relative">
        <GameLobby onJoinGame={joinGame} isWaiting={isWaiting} />
        {error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}
        {!isConnected && (
          <div className="fixed top-4 left-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <p className="font-medium">Connecting to server...</p>
          </div>
        )}
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

export default App;