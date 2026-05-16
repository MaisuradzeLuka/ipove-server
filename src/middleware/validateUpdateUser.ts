import type { NextFunction, Request, Response } from "express";
import { updateUserSchema } from "../lib/validation.js";
import type { UpdateUser } from "../types/auth.js";

export function validateUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  req.body = result.data as UpdateUser;
  next();
}
