import { Kafka } from "kafkajs";
import { EnvVariables } from "./config.js";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: [EnvVariables.Kafka_Broker],
});

const admin = kafka.admin();

const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: EnvVariables.Kafka_Topic, numPartitions: 1 },
    ],
  });
};

run();