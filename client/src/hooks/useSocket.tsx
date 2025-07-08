import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from '../types';



export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerColor, setPlayerColor] = useState<string>('');
  const [opponent, setOpponent] = useState<string>('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('waiting-for-opponent', () => {
      setIsWaiting(true);
      console.log('Waiting for opponent...');
    });


    newSocket.on('game-started', (data) => {
      console.log('Game started:', data);
      setGameState(data.gameState);
      setPlayerColor(data.playerColor);
      setOpponent(data.opponent);
      setIsWaiting(false);
      setGameEnded(false);
      
      // Store game info for potential reconnection
      localStorage.setItem('connect4_gameId', data.gameId);
      const currentUsername = data.opponent.trim() !== data.gameState.player1.trim() ? data.gameState.player1 : data.gameState.player2;
      localStorage.setItem('connect4_username', currentUsername);
      setUsername(currentUsername);
    });

    newSocket.on('game-update', (data) => {
      console.log('Game update:', data);
      setGameState(data.gameState);
    });

    newSocket.on('game-ended', (data) => {
      console.log('Game ended:', data);
      setGameState(data.gameState);
      setGameEnded(true);
      
      localStorage.removeItem('connect4_gameId');
    });

    newSocket.on('game-rejoined', (data) => {
      console.log('Game rejoined:', data);
      setGameState(data.gameState);
      setIsConnected(true);
    });

    newSocket.on('player-disconnected', (data) => {
      setError(`${data.disconnectedPlayer} disconnected. They have ${data.reconnectTimeLeft} seconds to reconnect.`);
      setTimeout(() => setError(null), 5000);
    });

    newSocket.on('move-error', (error) => {
      setError(error);
      setTimeout(() => setError(null), 3000);
    });

    newSocket.on('error', (error) => {
      setError(error);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinGame = (inputUsername: string) => {
    if (socket && inputUsername.trim()) {
      const cleanUsername = inputUsername.trim();
      setUsername(cleanUsername);
      localStorage.setItem('connect4_username', cleanUsername);
      socket.emit('join-game', { username: cleanUsername });
      console.log('Joining game with username:', cleanUsername);
    }
  };

  const makeMove = (column: number) => {
    if (socket && gameState && !gameEnded) {
      socket.emit('make-move', { gameId: gameState.gameId, column });
      console.log('Making move in column:', column);
    }
  };

  const rejoinGame = () => {
    const gameId = localStorage.getItem('connect4_gameId');
    const storedUsername = localStorage.getItem('connect4_username');
    
    if (socket && gameId && storedUsername) {
      socket.emit('rejoin-game', { gameId, username: storedUsername });
      setUsername(storedUsername);
      console.log('Rejoining game:', gameId, 'as:', storedUsername);
    }
  };

  const startNewGame = () => {
    const storedUsername = localStorage.getItem('connect4_username') || username;
    if (storedUsername) {
      setGameState(null);
      setPlayerColor('');
      setOpponent('');
      setGameEnded(false);
      setError(null);
      setIsWaiting(false);
      joinGame(storedUsername);
    }
  };

  return {
    socket,
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
  };
};