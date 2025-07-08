import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import GamePage from './pages/Game';
import { useSocket } from './hooks/useSocket';

function App() {
  const {
    gameState,
    playerColor,
    opponent,
    makeMove,
    startNewGame,
    isConnected,
    username,
    error,
    joinGame,
    rejoinGame,
    isWaiting
  } = useSocket();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage
          joinGame={joinGame}
          isWaiting={isWaiting}
          isConnected={isConnected}
          error={error}
          gameState={gameState}
        />} />
        <Route
          path="/game/:gameId"
          element={
            <GamePage
              gameState={gameState}
              playerColor={playerColor}
              opponent={opponent}
              makeMove={makeMove}
              startNewGame={startNewGame}
              isConnected={isConnected}
              username={username}
              error={error}
              rejoinGame={rejoinGame}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
