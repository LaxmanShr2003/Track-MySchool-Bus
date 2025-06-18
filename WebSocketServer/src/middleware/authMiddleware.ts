// middlewares/socketAuthMiddleware.ts
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET_KEY || env.JWT_ACCESS_SECRET_KEY;

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  console.log(token)
  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    console.log(decoded)
    socket.data.user = decoded;
    next(); // proceed to connection
  } catch (err) {
    return next(new Error("Authentication failed"));
  }
};
