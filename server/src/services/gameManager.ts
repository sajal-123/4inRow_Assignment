import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ConnectFourGame } from '../game/connectFour';
import { Bot } from '../game/bot';
import { GameData, Player } from '../types';
import { HandleAnalyticsEvents } from './KafkaEventsTrigger';


export class GameManager {
  private io: Server;
  private analytics: any;
  private games: Map<string, GameData> = new Map();
  private waitingPlayers: Map<string, Player> = new Map();
  private playerSockets: Map<string, { username: string; socket: Socket }> = new Map();
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(io: Server, analytics: any) {
    this.io = io;
    this.analytics = analytics;
  }

  async handleJoinGame(socket: Socket, data: { username: string }) {
    const { username } = data;

    console.log(`Player ${username} (${socket.id}) joining game`);
    await HandleAnalyticsEvents({
      gameId: uuidv4(), // Temporary ID, will be replaced when game starts
      player1: username,
      player2: 'bot',
      type: 'game_start',
      moveCount: 0
    });

    // Store player socket
    this.playerSockets.set(socket.id, {
      username,
      socket
    });

    // Check if there's a waiting player
    const waitingPlayer = Array.from(this.waitingPlayers.values())[0];

    if (waitingPlayer && waitingPlayer.username !== username) {
      // Match with waiting player
      console.log(`Matching ${username} with ${waitingPlayer.username}`);
      this.createGame(waitingPlayer, { username, socketId: socket.id });
      this.waitingPlayers.delete(waitingPlayer.socketId!);
    } else {
      // Add to waiting queue
      this.waitingPlayers.set(socket.id, {
        username,
        socketId: socket.id
      });

      socket.emit('waiting-for-opponent');
      console.log(`${username} added to waiting queue`);

      // Start bot match after 10 seconds
      setTimeout(() => {
        if (this.waitingPlayers.has(socket.id)) {
          console.log(`Starting bot game for ${username}`);
          this.createBotGame(socket.id, username);
          this.waitingPlayers.delete(socket.id);
        }
      }, 10000);
    }
  }

  async createGame(player1: Player, player2: Player) {
    const gameId = uuidv4();
    const game = new ConnectFourGame(gameId, player1.username, player2.username);

    this.games.set(gameId, {
      game,
      player1: { ...player1, color: 'red' },
      player2: { ...player2, color: 'yellow' },
      isBot: false
    });

    console.log(`Game ${gameId} created: ${player1.username} vs ${player2.username}`);

    // Notify both players
    const player1Socket = this.playerSockets.get(player1.socketId!)?.socket;
    const player2Socket = this.playerSockets.get(player2.socketId!)?.socket;
    console.log(`Notifying players: ${player1.username} and ${player2.username}-------------------------------------------------`);

    if (player1Socket) {
      player1Socket.join(gameId);
      player1Socket.emit('game-started', {
        gameId,
        opponent: player2.username,
        playerColor: 'red',
        gameState: game.getState()
      });
    }

    if (player2Socket) {
      player2Socket.join(gameId);
      player2Socket.emit('game-started', {
        gameId,
        opponent: player1.username,
        playerColor: 'yellow',
        gameState: game.getState()
      });
    }

    await HandleAnalyticsEvents({
      gameId,
      player1: player1.username,
      player2: player2.username,
      type: 'game_start',
      moveCount: 0
    });

  }

  async createBotGame(socketId: string, username: string) {
    const gameId = uuidv4();
    const game = new ConnectFourGame(gameId, username, 'Bot');
    const bot = new Bot(game, 'yellow');

    this.games.set(gameId, {
      game,
      player1: { username, socketId, color: 'red' },
      player2: { username: 'Bot', color: 'yellow' },
      bot,
      isBot: true
    });

    console.log(`Bot game ${gameId} created for ${username}`);

    const playerSocket = this.playerSockets.get(socketId)?.socket;
    if (playerSocket) {
      playerSocket.join(gameId);
      playerSocket.emit('game-started', {
        gameId,
        opponent: 'Bot',
        playerColor: 'red',
        gameState: game.getState()
      });
    }
    await HandleAnalyticsEvents({
      gameId,
      player1: username,
      player2: 'bot',
      type: 'game_start',
      moveCount: 0
    });

    // this.analytics.trackEvent('game_started', {
    //   gameId,
    //   player1: username,
    //   player2: 'Bot',
    //   gameType: 'pvb'
    // });
  }

  async handleMove(socket: Socket, data: { gameId: string; column: number }) {
    const { gameId, column } = data;
    const gameData = this.games.get(gameId);

    if (!gameData) {
      socket.emit('error', 'Game not found');
      return;
    }

    const { game, bot, isBot } = gameData;
    const playerData = this.playerSockets.get(socket.id);

    if (!playerData) {
      socket.emit('error', 'Player not found');
      return;
    }

    console.log(`${playerData.username} making move in column ${column}`);

    // Make player move
    const result = game.makeMove(column, playerData.username);

    if (!result.success) {
      socket.emit('move-error', result.error);
      return;
    }

    // Broadcast game state
    this.io.to(gameId).emit('game-update', {
      gameState: game.getState(),
      lastMove: { column, player: playerData.username }
    });
    await HandleAnalyticsEvents({
      gameId,
      player1: playerData.username,
      type: 'game_update',
      moveCount: 5,
      gameState: {
        board: this.games.get(gameId)?.game.board || [],
        currentPlayer: playerData.username,
        isDraw: false
      }
    });


    this.analytics.trackEvent('move_made', {
      gameId,
      player: playerData.username,
      column,
      moveNumber: game.moveCount
    });

    // Check if game ended
    if (game.winner || game.isDraw()) {
      await this.endGame(gameId, game.winner);
      return;
    }

    // Make bot move if it's a bot game
    if (isBot && !game.winner && !game.isDraw()) {
      setTimeout(() => {
        const botMove = bot!.makeMove(); // Bot is possibly undefined so to handle this i have give ! operator
        if (botMove !== null) {
          console.log(`Bot making move in column ${botMove}`);
          const botResult = game.makeMove(botMove, 'Bot');

          if (botResult.success) {
            this.io.to(gameId).emit('game-update', {
              gameState: game.getState(),
              lastMove: { column: botMove, player: 'Bot' }
            });
            const trigger = async () => {
              await HandleAnalyticsEvents({
                gameId,
                player1: 'bot',
                type: 'game_update',
                moveCount: 5,
                gameState: {
                  board: this.games.get(gameId)?.game.board || [],
                  currentPlayer: 'bot',
                  isDraw: false
                }
              });
            }
            trigger();

            this.analytics.trackEvent('move_made', {
              gameId,
              player: 'Bot',
              column: botMove,
              moveNumber: game.moveCount
            });

            // Check if bot won
            if (game.winner || game.isDraw()) {
              this.endGame(gameId, game.winner);
            }
          }
        }
      }, 1000); // Delay for bot move
    }
  }

  async endGame(gameId: string, winner: string | null) {
    const gameData = this.games.get(gameId);
    if (!gameData) return;

    const { game, player1, player2 } = gameData;

    console.log(`Game ${gameId} ended. Winner: ${winner || 'Draw'}`);

    // Notify players
    this.io.to(gameId).emit('game-ended', {
      winner,
      gameState: game.getState()
    });

    await HandleAnalyticsEvents({
      gameId,
      player1: player1.username,
      player2: player2.username,
      type: 'game_end',
      moveCount: game.moveCount,
      duration: Date.now() - game.startTime,
      winner
    });


    this.analytics.trackEvent('game_ended', {
      gameId,
      winner,
      duration: Date.now() - game.startTime,
      totalMoves: game.moves.length
    });

    // Clean up
    this.games.delete(gameId);
  }

  handleRejoinGame(socket: Socket, data: { gameId: string; username: string }) {
    const { gameId, username } = data;
    const gameData = this.games.get(gameId);

    // console.log(`${username} attempting to rejoin game ${gameId}`);

    if (!gameData) {
      socket.emit('error', 'Game not found');
      return;
    }

    // Clear reconnect timer
    const timerId = this.reconnectTimers.get(`${gameId}-${username}`);
    if (timerId) {
      clearTimeout(timerId);
      this.reconnectTimers.delete(`${gameId}-${username}`);
    }

    // Update player socket
    this.playerSockets.set(socket.id, {
      username,
      socket
    });

    // Rejoin game room
    socket.join(gameId);

    // Determine player color
    const playerColor = gameData.game.player1 === username ? 'red' : 'yellow';
    const opponent = gameData.game.player1 === username ? gameData.game.player2 : gameData.game.player1;

    // Send current game state
    socket.emit('game-started', {
      gameId,
      opponent,
      playerColor,
      gameState: gameData.game.getState()
    });

    console.log(`${username} rejoined game ${gameId}`);

    this.analytics.trackEvent('player_rejoined', {
      gameId,
      player: username
    });
  }

  handleDisconnect(socket: Socket) {
    const playerData = this.playerSockets.get(socket.id);
    if (!playerData) return;

    const { username } = playerData;

    console.log(`Player ${username} (${socket.id}) disconnected`);

    // Remove from waiting queue
    this.waitingPlayers.delete(socket.id);

    // Find active game
    for (const [gameId, gameData] of this.games.entries()) {
      const { player1, player2, game } = gameData;

      if (player1.username === username || player2.username === username) {
        // Start 30-second reconnect timer
        const timerId = setTimeout(() => {
          // Player didn't reconnect, end game
          const opponent = player1.username === username ? player2.username : player1.username;
          console.log(`${username} didn't reconnect, ${opponent} wins by forfeit`);
          this.endGame(gameId, opponent);
          this.reconnectTimers.delete(`${gameId}-${username}`);
        }, 30000);

        this.reconnectTimers.set(`${gameId}-${username}`, timerId);

        // Notify opponent
        this.io.to(gameId).emit('player-disconnected', {
          disconnectedPlayer: username,
          reconnectTimeLeft: 30
        });

        break;
      }
    }

    this.playerSockets.delete(socket.id);
  }
}

