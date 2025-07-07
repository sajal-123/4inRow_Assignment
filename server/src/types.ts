import { Socket } from "socket.io";
import { Bot } from "./game/bot";
import { ConnectFourGame } from "./game/connectFour";

export type CellColor = 'red' | 'yellow' | null;

export type PlayerName = string;

export interface Move {
  player: PlayerName;
  column: number;
  row: number;
  color: 'red' | 'yellow';
}

export interface GameState {
  gameId: string;
  board: CellColor[][];
  currentPlayer: PlayerName;
  winner: PlayerName | null;
  isDraw: boolean;
  moveCount: number;
  player1: PlayerName;
  player2: PlayerName;
}


export interface Player {
  username: string;
  socketId?: string;
  color?: 'red' | 'yellow';
  socket?: Socket;
}

export interface GameData {
  game: ConnectFourGame;
  player1: Player;
  player2: Player;
  bot?: Bot;
  isBot: boolean;
}