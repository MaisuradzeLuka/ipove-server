import type { NextFunction, Request, Response } from "express";
import { updateUserSchema } from "../lib/validation.js";
import type { UpdateUser } from "../types/auth.js";

type Errors = { path: string; message: string };

export function validateUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    const errors: Errors[] = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({ error: errors });
    return;
  }

  req.body = result.data as UpdateUser;
  next();
}
