import { uploadImage } from "./cloudinary.js";

export async function uploadSingleImageFile(
  file: Express.Multer.File | undefined,
) {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return uploadImage({ file: dataUri });
}
