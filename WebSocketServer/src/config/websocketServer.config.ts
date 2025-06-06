// config/websocketServer.config.ts
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

export const initializeWebSocketServer = (server: HTTPServer) => {
    const io = new Server(server, {
        cors: {
            origin: '*', // Adjust for production
        },
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('message', (data) => {
            console.log('Received GPS data:', data);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
