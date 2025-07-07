import React, { useState } from 'react';
import { Users, Bot, Gamepad2 } from 'lucide-react';

interface GameLobbyProps {
  onJoinGame: (username: string) => void;
  isWaiting: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onJoinGame, isWaiting }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoinGame(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Connect Four</h1>
          <p className="text-gray-600 text-lg">Real-time multiplayer game</p>
        </div>

        {!isWaiting ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                Enter your username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Your username"
                required
                maxLength={20}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg shadow-lg transform hover:scale-105"
            >
              Join Game
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Looking for opponent...</h3>
              <p className="text-gray-600">
                If no player joins in 10 seconds, you'll play against our bot!
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-center gap-3 text-blue-700">
                <Bot className="w-6 h-6" />
                <span className="font-medium">Smart bot will join automatically</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobby;