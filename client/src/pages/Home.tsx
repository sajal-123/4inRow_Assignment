import React, { useEffect } from 'react';
import GameLobby from '../components/GameLobby';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  joinGame: (userInput:string) => void
  isWaiting: boolean
  isConnected: boolean
  error: string | null,
  gameState: any
}

const HomePage: React.FC<HomePageProps> = ({
  joinGame,
  isWaiting,
  isConnected,
  error,
  gameState
}) => {
  const navigate = useNavigate();
  // Check if the user is already in a game
  useEffect(() => {
    if (gameState) {
      navigate("/game/" + gameState.gameId);
    }
  }, [gameState, navigate]);


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

export default HomePage;
