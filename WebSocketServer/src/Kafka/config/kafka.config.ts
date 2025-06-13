import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "websocket-server",
  brokers: ["kafka:9092"], // This must match your docker-compose hostname and port
});

export const producer = kafka.producer();

export async function initKafka() {
  // -- Admin: create topic if missing
  const admin = kafka.admin();
  await admin.connect();

  const topics = await admin.listTopics();
  if (!topics.includes("gps")) {
    await admin.createTopics({
      topics: [{ topic: "gps", numPartitions: 1, replicationFactor: 1 }],
    });
    console.log("✅  Kafka topic 'gps' created");
  } else {
    console.log("ℹ️  Kafka topic 'gps' already exists");
  }
  await admin.disconnect();

  // -- Producer: single shared connection
  await producer.connect();
  console.log("✅  Kafka producer connected");
}
