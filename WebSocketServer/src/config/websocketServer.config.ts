// config/websocketServer.config.ts
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { socketAuthMiddleware } from '../middleware/authMiddleware';
import { safeSocketHandler } from '../lib/errorHandler';
import { socketMessageMiddleware } from '../middleware/socketMessageMiddleware';

export const initializeWebSocketServer = (server: HTTPServer) => {
    const io = new Server(server, {
        cors: {
            origin: '*', // Adjust for production
        },
    });

   // io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("message", (data) =>
  safeSocketHandler(socketMessageMiddleware)(data)(socket)
);


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
