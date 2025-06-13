import { createServer } from "http";
import { initializeDataSource } from "./config/orm.config";
import { initializeWebSocketServer } from "./config/websocketServer.config";
import { env } from "./config/env.config";
import { initKafka } from "./Kafka/config/kafka.config";

(async function main() {
  await initKafka();
  initializeDataSource();
  const httpServer = createServer();
  initializeWebSocketServer(httpServer);
  const PORT = env.SERVER_PORT;
  httpServer.listen(PORT, () => {
    console.log(`Websocket server is running at port ${PORT}`);
  });
  
})();
