import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
const defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "uploads";

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export type UploadImageInput = {
  file: string;
  folder?: string;
  publicId?: string;
  tags?: string[];
};

export type UploadedImage = {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
};

export async function uploadImage({
  file,
  folder = defaultFolder,
  publicId,
  tags = [],
}: UploadImageInput): Promise<UploadedImage> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  const result = await cloudinary.uploader.upload(file, {
    folder,
    public_id: publicId,
    resource_type: "image",
    tags,
  });

  return {
    url: result.url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function uploadImages(
  images: UploadImageInput[],
): Promise<UploadedImage[]> {
  return Promise.all(images.map((image) => uploadImage(image)));
}
