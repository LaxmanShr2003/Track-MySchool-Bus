import { createServer, Server } from "http";
import { initializeDataSource } from "./config/orm.config";
import { initializeWebSocketServer } from "./config/websocketServer.config";
import { env } from "./config/env.config";
import { initKafka } from "./Kafka/config/kafka.config";
import { runGpsDbConsumer } from "./Kafka/consumer/gpsDb.consumer";
import { runGpsFanoutConsumer } from "./Kafka/consumer/gpsFanOut.consumer";

(async function main() {
  try {
    await initKafka();
    initializeDataSource();
    const httpServer = createServer();
    initializeWebSocketServer(httpServer);
    const PORT = env.SERVER_PORT;
    httpServer.listen(PORT, () => {
      console.log(`Websocket server is running at port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
