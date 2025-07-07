import { Kafka } from 'kafkajs';
import gameEventModel, { connectToDatabase } from './gameEventModel.js';
import { EnvVariables } from './config.js';

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: [EnvVariables.Kafka_Broker],
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

// MongoDB connection
connectToDatabase();

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: EnvVariables.Kafka_Topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        const { gameId, type } = event;

        console.log(' Event received:', {
          ...event,
          starttimestamp: event.timestamp,
          endtimestamp: event.timestamp
        });


        if (type === 'game_start') {
          try {
            // Database Operation to insert a new game_start event
            
            // await gameEventModel.updateOne(
            //   { gameId },
            //   {
            //     $setOnInsert: {
            //       gameId,
            //       players: event.players,
            //       type: event.type,
            //       starttimestamp: event.timestamp
            //     }
            //   },
            //   { upsert: true }
            // );

            console.log(` Game started: ${gameId}`);
          } catch (err) {
            console.error(' Failed to insert game_start:', err.message);
          }
        }

        else if (type === 'game_end') {
          try {
            // Database Operation to update an existing game_end event

            // await gameEventModel.updateOne(
            //   { gameId },
            //   {
            //     $set: {
            //       winner: event.winner,
            //       duration: event.duration,
            //       moveCount: event.moveCount, // optionally update
            //       endtimestamp: event.timestamp, // optionally update
            //     }
            //   }
            // );
            console.log(` Game ended: ${gameId} - Winner: ${event.winner}`);
          } catch (err) {
            console.error(' Failed to update game_end:', err.message);
          }
        }

        else if (type === 'game_update') {
          console.log(` Game update for ${gameId}:`, event.gameState);
        }
      },
    });
  } catch (err) {
    console.error('Kafka consumer error:', err);
  }
};

run();
