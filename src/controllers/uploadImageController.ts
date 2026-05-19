import type { Request, Response } from "express";
import { uploadSingleImageFile } from "../lib/imageUpload.js";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const uploadedImage = uploadSingleImageFile(req.file);

    return res.status(200).json((await uploadedImage).url);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
