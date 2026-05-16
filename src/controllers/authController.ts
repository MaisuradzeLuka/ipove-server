import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { users } from "../db/schemas/schema.js";
import {
  hashPassword,
  signUserToken,
  verifyPassword,
} from "../lib/authCrypto.js";
import type { SignUpBody, UpdateUser } from "../types/auth.js";
import { uploadSingleImageFile } from "../lib/imageUpload.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCredentials(body: unknown): { email: string; password: string } {
  const b = body as Partial<SignUpBody>;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";
  return { email, password };
}

function issueUserJwt(
  userId: number | string | bigint,
  email: string,
  context: string,
): { ok: true; token: string } | { ok: false; error: string } {
  try {
    return { ok: true, token: signUserToken(userId, email) };
  } catch (err: any) {
    console.error(`${context} JWT error:`, err);
    return { ok: false, error: err.message };
  }
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = parseCredentials(req.body);

  if (!email || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const [existing] = await db
    .select({ userId: users.userId })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);

  const fullUser = {
    email,
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [created] = await db
    .insert(users)
    .values(fullUser)
    .returning({ userId: users.userId, email: users.email });

  if (!created) {
    res.status(500).json({ error: "Could not create user" });
    return;
  }

  const issued = issueUserJwt(created.userId, created.email, "signUp");
  if (!issued.ok) {
    res.status(500).json({ error: issued.error });
    return;
  }

  res.status(201).json({
    user: { userId: created.userId, email: created.email },
    token: issued.token,
  });
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = parseCredentials(req.body);

  if (!email || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  const [user] = await db
    .select({
      userId: users.userId,
      email: users.email,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const issued = issueUserJwt(user.userId, user.email, "signIn");
  if (!issued.ok) {
    res.status(500).json({ error: issued.error });
    return;
  }

  res.status(200).json({
    user: { userId: user.userId, email: user.email },
    token: issued.token,
  });
};

export const updateUser = async (
  req: Request<{}, {}, UpdateUser>,
  res: Response,
): Promise<void> => {
  const values = req.body;

  try {
    const updatedUser = await db
      .update(users)
      .set(values)
      .where(eq(users.userId, values.userId))
      .returning();

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully" });
    return;
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
