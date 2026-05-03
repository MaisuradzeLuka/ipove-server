import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { users } from "../db/schemas/schema.js";
import { hashPassword, signUserToken } from "../lib/authCrypto.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signUp = async (req: Request, res: Response) => {
  const body = req.body as { email?: unknown; password?: unknown };
  const emailRaw =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!emailRaw || !EMAIL_RE.test(emailRaw)) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, emailRaw))
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [created] = await db
    .insert(users)
    .values({ email: emailRaw, passwordHash })
    .returning({ id: users.id, email: users.email });

  if (!created) {
    res.status(500).json({ error: "Could not create user" });
    return;
  }

  console.log(created);

  let token: string;
  try {
    token = signUserToken(created.id, created.email);
  } catch (err) {
    console.error("signUp JWT error:", err);
    const message =
      err instanceof Error && err.message === "JWT_SECRET is not set"
        ? "JWT_SECRET is not set in environment"
        : "Could not issue token";
    res.status(500).json({ error: message });
    return;
  }

  return res.status(201).json({
    user: { id: created.id, email: created.email },
    token,
  });
};
