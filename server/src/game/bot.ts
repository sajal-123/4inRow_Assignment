import { CellColor } from "../types";
type Board = CellColor[][];
type Color = 'red' | 'yellow';

export class Bot {
  game: { board: Board };
  color: Color;
  opponentColor: Color;

  constructor(game: { board: Board }, color: Color) {
    this.game = game;
    this.color = color;
    this.opponentColor = color === 'red' ? 'yellow' : 'red';
  }

  makeMove(): number | null {

    const board = this.game.board;

    // 1. Check if bot can win
    for (let col = 0; col < 7; col++) {
      if (this.canDropInColumn(board, col)) {
        const row = this.getDropRow(board, col);
        if (this.checkWinAtPosition(board, row, col, this.color)) {
          return col;
        }
      }
    }

    // 2. Check if bot needs to block opponent's win
    for (let col = 0; col < 7; col++) {
      if (this.canDropInColumn(board, col)) {
        const row = this.getDropRow(board, col);
        if (this.checkWinAtPosition(board, row, col, this.opponentColor)) {
          return col;
        }
      }
    }

    // 3. Strategic moves - prefer center columns
    const strategicOrder = [3, 2, 4, 1, 5, 0, 6];

    for (const col of strategicOrder) {
      if (this.canDropInColumn(board, col)) {
        const row = this.getDropRow(board, col);

        // Avoid moves that give opponent a winning opportunity
        if (!this.givesOpponentWin(board, row, col)) {
          return col;
        }
      }
    }

    // 4. Fallback - any available move
    for (let col = 0; col < 7; col++) {
      if (this.canDropInColumn(board, col)) {
        return col;
      }
    }

    return null;
  }

  private canDropInColumn(board: Board, col: number): boolean {
    return board[0][col] === null;
  }

  private getDropRow(board: Board, col: number): number {
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  }

  private checkWinAtPosition(board: Board, row: number, col: number, color: Color): boolean {
    // Temporarily place the piece
    board[row][col] = color;

    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal /
      [1, -1]   // Diagonal \
    ];

    let hasWin = false;

    for (const [dr, dc] of directions) {
      let count = 1;

      // Check positive direction
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
        count++;
        r += dr;
        c += dc;
      }

      // Check negative direction
      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= 4) {
        hasWin = true;
        break;
      }
    }

    // Remove the temporary piece
    board[row][col] = null;

    return hasWin;
  }

  private givesOpponentWin(board: Board, row: number, col: number): boolean {
    // Check if placing our piece allows opponent to win on next move
    board[row][col] = this.color;

    // Check the row above (if it exists)
    if (row > 0) {
      const aboveRow = row - 1;
      if (this.checkWinAtPosition(board, aboveRow, col, this.opponentColor)) {
        board[row][col] = null;
        return true;
      }
    }

    board[row][col] = null;
    return false;
  }
}

