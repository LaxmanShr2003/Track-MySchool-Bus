import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "gps-client",
  brokers: ["kafka:9092"], // This must match your docker-compose hostname and port
});