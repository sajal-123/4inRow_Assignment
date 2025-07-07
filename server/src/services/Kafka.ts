import { Kafka } from "kafkajs";


export const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9094"],
});


export const producer = kafka.producer();
export const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected!");
  } catch (err) {
    console.log("Error connecting to Kafka", err);
  }
};