// middlewares/socketMessageMiddleware.ts
import { Socket } from "socket.io";
import { WebSocketError } from "../lib/webSocketError";
import { gpsDataSchema } from "../schemaValidator/gpsData";
import { producer } from "../Kafka/config/kafka.config";
// your Kafka logic

export async function socketMessageMiddleware(socket: Socket, data: any) {
  const user = socket.data.user;
  if (!user) throw new WebSocketError("Unauthorized", 401);

  // if (!data) {
  //   console.log(data);
  // }

  // try {
  //   await producer.send({
  //     topic: "gps",
  //     messages: [
  //       {
  //         key: data.routeId,
  //         value: JSON.stringify(data),
  //       },
  //     ],
  //   });
  //   console.log("✅ GPS data sent to Kafka topic 'gps'");
  // } catch (error) {
  //   console.error("❌ Failed to send to Kafka:", error);
  //   throw new WebSocketError("Internal Kafka error", 500);
  // }
  const { type } = data;

  switch (user.role) {
    case "DRIVER":
      switch (type) {
        case "GPS_UPDATE":
          // const parsedGps = gpsDataSchema.parse(data);

          //   await sendToKafka("gps.updates", {
          //     userId: user.id,
          //     ...parsedGps,
          //   });
          await producer.send({
            topic: "gps",
            messages: [
              {
                key: data.routeId,
                value: JSON.stringify(data),
              },
            ],
          });
          console.log("✅ GPS data sent to Kafka topic 'gps'");
          break;

        case "ATTENDANCE":
          // Parse & send attendance to Kafka
          break;

        default:
          throw new WebSocketError("Unknown message type", 400);
      }
      break;

    case "USER":
      switch (type) {
        case "CHAT":
          // Validate chat schema and send
          break;
        default:
          throw new WebSocketError("Unsupported type for USER", 400);
      }
      break;

    default:
      throw new WebSocketError("Forbidden role", 403);
  }
}
