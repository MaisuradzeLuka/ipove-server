import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../lib/authCookie.js";
import { verifyUserToken } from "../lib/authCrypto.js";

function getTokenFromCookie(req: Request): string | undefined {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  return typeof token === "string" && token.length > 0 ? token : undefined;
}

export function authenticateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = getTokenFromCookie(req);
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    req.user = verifyUserToken(token);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    console.error("JWT verification error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
}
