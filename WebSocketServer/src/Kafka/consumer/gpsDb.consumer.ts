// src/kafka/consumers/gpsDbConsumer.ts
import { kafka as gpsKafka } from "../config/kafka.client.gps";
import { insertGpsBatch } from "../../lib/insertGpsBatch";

const gpsDbConsumer = gpsKafka.consumer({ groupId: "gps-db-writer-group" });

const buffer: any[] = [];
const FLUSH_INTERVAL = 5000;

async function flushToDb() {
  if (buffer.length === 0) return;
  const toInsert = buffer.splice(0, buffer.length);
  await insertGpsBatch(toInsert);
}

setInterval(flushToDb, FLUSH_INTERVAL);

export async function runGpsDbConsumer() {
  await gpsDbConsumer.connect();
  await gpsDbConsumer.subscribe({ topic: "gps", fromBeginning: false });

  await gpsDbConsumer.run({
    eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
      for (const msg of batch.messages) {
        if (!msg.value) continue;
        const gps = JSON.parse(msg.value.toString());
        buffer.push(gps);
        resolveOffset(msg.offset);
      }
      await heartbeat();
    },
  });

  console.log("🗄️ GPS DB consumer running");
}
