
import { Kafka } from "kafkajs";
export const kafka = new Kafka({
  clientId: "message-client",
  brokers: ["kafka:9092"],
});
