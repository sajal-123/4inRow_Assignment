import { producer } from "./Kafka";

type GameEventType = "game_start" | "game_end" | "game_update";

interface GameState {
  board: (string | null)[][];
  currentPlayer: string;
  isDraw: boolean;
}

interface GameEventOptions {
  gameId: string;
  player1: string;
  player2?: string;                // only if start or end else null
  winner?: string | null;         // only for game_end
  duration?: number;              // only for game_end
  type: GameEventType;
  moveCount: number;
  gameState?: GameState;          // only for game_update
}

export const HandleAnalyticsEvents = async (options: GameEventOptions) => {
  const { gameId, player1, player2, winner, duration, type, moveCount, gameState } = options;

  const timestamp = new Date().toISOString();

  // Common fields
  const baseEvent = {
    gameId,
    players: [player1, player2],
    type,
    moveCount,
    timestamp,
  };

  // Extend event based on type
  let event: any = { ...baseEvent };

  if (type === "game_end") {
    event = {
      ...event,
      winner,
      duration,
    };
  } else if (type === "game_update") {
    event = {
      ...event,
      gameState,
    };
  }

  // Send to Kafka
  await producer.send({
    topic: "game-events",
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log(`[Kafka] Event sent: ${type.toUpperCase()}`, event);
};
