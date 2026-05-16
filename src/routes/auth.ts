import express from "express";
import multer from "multer";
import { signIn, signUp, updateUser } from "../controllers/authController.js";
import { validateUpdateUser } from "../middleware/validateUpdateUser.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.put("/update-user", validateUpdateUser, updateUser);

export default router;
