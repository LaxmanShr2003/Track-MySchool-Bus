export class WebSocketError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status =
        statusCode >= 400 && statusCode <= 500 ? "fail" : "Internal server error";
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }