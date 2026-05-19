import express from "express";
import { uploadImage } from "../controllers/uploadImageController.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);

export default router;
