// src/kafka/consumers/gpsFanoutConsumer.ts
import { kafka as kafkaClient } from "../config/kafka.client.gps";
import { Server } from "socket.io";

const gpsFanoutConsumer = kafkaClient.consumer({ groupId: "gps-fanout-group" });

export async function runGpsFanoutConsumer(io: Server) {
  await gpsFanoutConsumer.connect();
  await gpsFanoutConsumer.subscribe({ topic: "gps", fromBeginning: false });

  await gpsFanoutConsumer.run({
    eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
      for (const m of batch.messages) {
        if (!m.value) continue;
        const gps = JSON.parse(m.value.toString());
        if (!gps.routeId) continue;

        io.to(gps.routeId).emit("gps:update", gps);
        resolveOffset(m.offset);
      }
      await heartbeat();
    },
  });

  console.log("📡 GPS fan-out consumer running");
}
