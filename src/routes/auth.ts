import express from "express";
import {
  signIn,
  signOut,
  signUp,
  updateUser,
} from "../controllers/authController.js";
import { authenticateJwt } from "../middleware/authenticateJwt.js";
import { validateUpdateUser } from "../middleware/validateUpdateUser.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.put(
  "/update-user",
  authenticateJwt,
  validateUpdateUser,
  updateUser,
);

export default router;
