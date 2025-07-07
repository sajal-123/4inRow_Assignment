import mongoose from 'mongoose';
import { EnvVariables } from './config.js';

const gameEventSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  players: [String],
  type: { type: String, enum: ['game_start', 'game_update', 'game_end'], required: true },
  winner: String,
  duration: Number,
  moveCount: Number,
  starttimestamp: { type: Date, default: Date.now },
  endtimestamp: { type: Date, default: Date.now },
});

export default mongoose.model('GameEvent', gameEventSchema);
export const connectToDatabase = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...',EnvVariables.MONGO_URI);
    await mongoose.connect(EnvVariables.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
  }
};