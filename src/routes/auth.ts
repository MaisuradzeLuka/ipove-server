import express from "express";
import { signIn, signUp, updateUser } from "../controllers/authController.js";
import { validateUpdateUser } from "../middleware/validateUpdateUser.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.put("/update-user", validateUpdateUser, updateUser);

export default router;
