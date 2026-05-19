import type { AuthTokenPayload } from "../lib/authCrypto.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
