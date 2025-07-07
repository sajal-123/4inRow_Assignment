import { PlayerName,CellColor,Move,GameState } from "../types";
export class ConnectFourGame {
  gameId: string;
  player1: PlayerName;
  player2: PlayerName;
  board: CellColor[][];
  currentPlayer: PlayerName;
  winner: PlayerName | null;
  moves: Move[];
  startTime: number;
  moveCount: number;

  constructor(gameId: string, player1: PlayerName, player2: PlayerName) {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.board = Array(6).fill(null).map(() => Array(7).fill(null));
    this.currentPlayer = player1;
    this.winner = null;
    this.moves = [];
    this.startTime = Date.now();
    this.moveCount = 0;
  }


  makeMove(column: number, player: PlayerName): { success: boolean; error?: string } {
    if (this.winner) {
      return { success: false, error: 'Game already ended' };
    }

    if (player !== this.currentPlayer) {
      return { success: false, error: 'Not your turn' };
    }

    if (column < 0 || column > 6) {
      return { success: false, error: 'Invalid column' };
    }

    // Find the lowest available row
    let row = -1;
    // Instead of LinearSearh we can also apply Binary Search
    // but since the board is small, linear search is sufficient
    for (let r = 5; r >= 0; r--) {
      if (this.board[r][column] === null) {
        row = r;
        break;
      }
    }

    if (row === -1) {
      return { success: false, error: 'Column is full' };
    }

    const color: 'red' | 'yellow' = player === this.player1 ? 'red' : 'yellow';
    this.board[row][column] = color;
    this.moves.push({ player, column, row, color });
    this.moveCount++;

    if (this.checkWin(row, column, color)) {
      this.winner = player;
    }

    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;

    return { success: true };
  }

  private checkWin(row: number, col: number, color: 'red' | 'yellow'): boolean {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal /
      [1, -1]   // Diagonal \
    ];

    for (const [dr, dc] of directions) {
      let count = 1;

      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === color) {
        count++;
        r += dr;
        c += dc;
      }

      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === color) {
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

  isDraw(): boolean {
    return this.moveCount >= 42 && !this.winner;
  }
  getState(): GameState {
    return {
      gameId: this.gameId,
      board: this.board,
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      isDraw: this.isDraw(),
      moveCount: this.moveCount,
      player1: this.player1,
      player2: this.player2
    };
  }
}
