import dotenv from 'dotenv';
dotenv.config();

export const EnvVariables = {
  MONGO_URI: process.env.MONGO_URI,
  Kafka_Broker: process.env.KAFKA_BROKER || "localhost:9094",
  Kafka_Topic: process.env.KAFKA_TOPIC || "game-events",
}
