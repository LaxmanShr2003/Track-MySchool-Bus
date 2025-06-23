import { runGpsDbConsumer } from "../consumer/gpsDb.consumer";
import { runGpsFanoutConsumer } from "../consumer/gpsFanOut.consumer";
import { Server } from "socket.io";
export async function initializeKafkaConsumer(io:Server) {
  try {
    runGpsFanoutConsumer(io); // 🔄 Real-time GPS to clients
    //runMiscConsumer(io);       // 💬 Chat, alert, attendance
    runGpsDbConsumer();
  } catch (error) {
    console.log("consumer failed to start");
  }
}
