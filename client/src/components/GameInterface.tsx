import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import Leaderboard from './Leaderboard';
import { Trophy, Users, Clock, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import type { GameInterfaceProps } from '../types';


const GameInterface: React.FC<GameInterfaceProps> = ({
  gameState,
  playerColor,
  opponent,
  onMove,
  onNewGame,
  isConnected,
  username
}) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const isMyTurn = gameState.currentPlayer === username;

  useEffect(() => {
    setGameEnded(!!gameState.winner || gameState.isDraw);
  }, [gameState.winner, gameState.isDraw]);

  const getGameResult = () => {
    if (gameState.isDraw) return 'Draw!';
    if (gameState.winner === username) return 'You Win! 🎉';
    if (gameState.winner === 'Bot') return 'Bot Wins! 🤖';
    return `${gameState.winner} Wins! 🏆`;
  };

  const getGameResultColor = () => {
    if (gameState.isDraw) return 'text-yellow-600';
    if (gameState.winner === username) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Connect Four</h1>
                <p className="text-gray-600 text-base md:text-lg">Playing against {opponent}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-center">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>

              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>

              {gameEnded && (
                <button
                  onClick={onNewGame}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Game
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Game and Status */}
          <div className="xl:col-span-3 space-y-6">
            <GameBoard
              board={gameState.board}
              onColumnClick={onMove}
              currentPlayer={gameState.currentPlayer}
              playerColor={playerColor}
              isMyTurn={isMyTurn}
              gameEnded={gameEnded}
            />

            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-gray-600" />
                  <span className="text-gray-600 text-lg font-medium">
                    Move {gameState.moveCount}
                  </span>
                </div>
                {gameEnded && (
                  <div className={`text-xl md:text-2xl font-bold ${getGameResultColor()}`}>
                    {getGameResult()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Players</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full shadow-md"></div>
                    <span className="font-semibold text-gray-800">{gameState.player1}</span>
                  </div>
                  {playerColor === 'red' && (
                    <span className="text-sm text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-md"></div>
                    <span className="font-semibold text-gray-800">{gameState.player2}</span>
                  </div>
                  {playerColor === 'yellow' && (
                    <span className="text-sm text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            {showLeaderboard && (
              <Leaderboard onClose={() => setShowLeaderboard(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInterface;
