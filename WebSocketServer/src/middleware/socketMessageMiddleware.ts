// middlewares/socketMessageMiddleware.ts
import { Socket } from "socket.io";
import { WebSocketError } from "../lib/webSocketError";
import { gpsDataSchema } from "../schemaValidator/gpsData";
// your Kafka logic

export async function socketMessageMiddleware(socket: Socket, data: any) {
  const user = socket.data.user;
  if (!user) throw new WebSocketError("Unauthorized", 401);

  const { type } = data;

  switch (user.role) {
    case "DRIVER":
      switch (type) {
        case "GPS_UPDATE":
          const parsedGps = gpsDataSchema.parse(data);
        //   await sendToKafka("gps.updates", {
        //     userId: user.id,
        //     ...parsedGps,
        //   });
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
