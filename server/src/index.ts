import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './services/gameManager';
// import { Database } from './database.js';
import { Analytics } from './Analytics';
import { connectToKafka } from './services/Kafka';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});


app.use(cors());
app.use(express.json());



const db: any = "";
const analytics = new Analytics();
const gameManager = new GameManager(io, db, analytics);

// REST API
app.get('/api/leaderboard', async (_req, res) => {
  try {
    const leaderboard = await db.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game', (data) => gameManager.handleJoinGame(socket, data));
  socket.on('make-move', (data) => gameManager.handleMove(socket, data));
  socket.on('rejoin-game', (data) => gameManager.handleRejoinGame(socket, data));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameManager.handleDisconnect(socket);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  connectToKafka();
  console.log(`✅ Server running on port ${PORT}`);
});
