  import * as jwt from "jsonwebtoken";

  export type TokenPayload = {
    id: string;
    role: string;
    email: string;
    isActive:boolean;
  };

  export type Token = {
    payload: TokenPayload;
    secretKey: string;
  
  };

  export class JWT {
    static sign({ payload, secretKey }: Token) {
      const token = jwt.sign(payload, secretKey,{expiresIn:'1h'})
      return token;
    }

    static verify<T = TokenPayload>(token: string, secretKey: string): T {
    try {
      return jwt.verify(token, secretKey) as T;
    } catch (error) {
      // Handle specific JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }
  }
