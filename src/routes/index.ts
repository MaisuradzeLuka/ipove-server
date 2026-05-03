import type { Express } from "express";
import express from "express";
import { getRoot } from "../controllers/healthController.js";

export function registerRoutes(app: Express): void {
  app.use(express.json());
  app.get("/", getRoot);
}
