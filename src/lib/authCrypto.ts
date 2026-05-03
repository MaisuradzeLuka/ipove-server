import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signUserToken(
  userId: number | string | bigint,
  email: string,
): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret?.length) {
    throw new Error("JWT_SECRET is not set");
  }
  const payload = { sub: String(userId), email };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}
