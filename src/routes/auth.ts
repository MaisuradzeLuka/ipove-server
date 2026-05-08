import express from "express";
import multer from "multer";
import { signIn, signUp } from "../controllers/authController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

export default router;
