export interface GameState {
  gameId: string;
  board: (string | null)[][];
  currentPlayer: string;
  winner: string | null;
  isDraw: boolean;
  moveCount: number;
  player1: string;
  player2: string;
}

export interface GameState {
  gameId: string;
  board: (string | null)[][];
  currentPlayer: string;
  winner: string | null;
  isDraw: boolean;
  moveCount: number;
  player1: string;
  player2: string;
}

export interface GameInterfaceProps {
  gameState: GameState;
  playerColor: string;
  opponent: string;
  onMove: (column: number) => void;
  onNewGame: () => void;
  isConnected: boolean;
  username: string;
}