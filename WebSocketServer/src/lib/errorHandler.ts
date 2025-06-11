// utils/safeSocketHandler.ts
import { ZodError } from "zod";
import { Socket } from "socket.io";
import { WebSocketError } from "./webSocketError";

export const safeSocketHandler = (
  handler: (socket: Socket, data: any) => Promise<void>
) => {
  return async (socket: Socket, data: any) => {
    try {
      await handler(socket, data);
    } catch (err: any) {
      let message = "Internal server error";
      let status = 500;

      if (err instanceof WebSocketError) {
        message = err.message;
        status = err.statusCode;
      } else if (err instanceof ZodError) {
        message = "Validation failed";
        status = 422;
        // Optional: send all detailed Zod errors
        return socket.emit("error", {
          message,
          status,
          issues: err.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      } else if (err instanceof Error) {
        message = err.message;
      }

      console.error("Socket error:", message);
      socket.emit("error", { message, status });
    }
  };
};
