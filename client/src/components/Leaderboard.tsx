import React, { useState, useEffect } from 'react';
import { Trophy, X, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  wins: number;
  losses: number;
  games_played: number;
}

interface LeaderboardProps {
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{index + 1}</div>;
    }
  };

  const getWinRate = (wins: number, gamesPlayed: number) => {
    if (gamesPlayed === 0) return 0;
    return Math.round((wins / gamesPlayed) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Error loading leaderboard: {error}</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No players yet. Be the first to play!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.username}
              className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                index === 0 ? 'border-yellow-300 bg-yellow-50' :
                index === 1 ? 'border-gray-300 bg-gray-50' :
                index === 2 ? 'border-orange-300 bg-orange-50' :
                'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index)}
                <div>
                  <div className="font-semibold text-gray-800">{player.username}</div>
                  <div className="text-sm text-gray-600">
                    {player.games_played} games • {getWinRate(player.wins, player.games_played)}% win rate
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-green-600">{player.wins}W</div>
                <div className="text-sm text-red-600">{player.losses}L</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;