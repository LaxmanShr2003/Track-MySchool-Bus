// config/websocketServer.config.ts
import { Server, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import { socketAuthMiddleware } from "../middleware/authMiddleware";
import { safeSocketHandler } from "../lib/errorHandler";
import { socketMessageMiddleware } from "../middleware/socketMessageMiddleware";

export const initializeWebSocketServer = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust for production
    },
  });

  //     io.use(socketAuthMiddleware);

  //     io.on('connection', (socket) => {
  //         console.log(`Client connected: ${socket.id}`);

  //         socket.on("message", (data) =>
  //         safeSocketHandler(socketMessageMiddleware)(data)(socket)
  // );

  //         socket.on('disconnect', () => {
  //             console.log(`Client disconnected: ${socket.id}`);
  //         });
  //     });

  /* -------------------------------------------------- */
  /* Attach JWT auth middleware                         */
  /* -------------------------------------------------- */
  io.use(socketAuthMiddleware);

  /* -------------------------------------------------- */
  /* Handle *one* connection for every client           */
  /* -------------------------------------------------- */
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Client connected:", socket.id);

    /** ---------- 1️⃣  Room assignment by role ---------- **/
    const user = socket.data.user as {
      id: string;
      role: "DRIVER" | "PARENT" | "ADMIN";
      routeId?: string; // DRIVER or PARENT has this
    };

    // DRIVER or PARENT auto‑join their single route
    if (user.role === "DRIVER" || user.role === "PARENT") {
      if (user.routeId) {
        socket.join(user.routeId);
        console.log(`✅ ${socket.id} (${user.role}) joined ${user.routeId}`);
      } else {
        console.warn(`⚠️ ${user.role} has no routeId`);
        socket.disconnect();
        return;
      }
    }

    // ADMIN: front‑end decides which route to watch
    if (user.role === "ADMIN") {
      socket.on("join:route", (routeId: string) => {
        // leave old route rooms (keep private room)
        Array.from(socket.rooms)
          .filter((r) => r !== socket.id)
          .forEach((r) => socket.leave(r));

        socket.join(routeId);
        socket.emit("route:joined", routeId);
        console.log(`👑 ADMIN ${socket.id} switched to ${routeId}`);
      });
    }

    /** ---------- 2️⃣  Incoming generic messages ---------- **/
    // Everyone (driver, parent, admin) can emit a "message"
    // We forward it to socketMessageMiddleware, which produces to Kafka
    socket.on(
      "message",
      (data) =>
        // if you keep safeSocketHandler-wrapper:
        safeSocketHandler(socketMessageMiddleware)(data)(socket)
      // Or simply: socketMessageMiddleware(socket, data);
    );

    socket.on("disconnect", () =>
      console.log("❌ Client disconnected:", socket.id)
    );
  });
};
