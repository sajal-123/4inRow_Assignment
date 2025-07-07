import gameEventModel from "./gameEventModel";

// Average game duration
export async function getAverageDuration() {
  const result = await gameEventModel.aggregate([
    { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
  ]);
  return result[0]?.avgDuration || 0;
}

// Most frequent winners
export async function getTopWinners(limit = 5) {
  return gameEventModel.aggregate([
    { $group: { _id: '$winner', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
}

// Games per hour
export async function getGamesPerHour() {
  return gameEventModel.aggregate([
    {
      $group: {
        _id: { $hour: '$timestamp' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
}

// User-specific stats
export async function getUserStats(username) {
  const played = await gameEventModel.countDocuments({ players: username });
  const won = await gameEventModel.countDocuments({ winner: username });
  return { played, won, winRate: played ? (won / played) * 100 : 0 };
}
