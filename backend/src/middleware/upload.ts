import multer from "multer";
import { type Request } from "express";
import { MAX_UPLOAD_SIZE_BYTES, ALLOWED_IMAGE_MIME_TYPES, UPLOAD_FIELD_NAME } from "../constants/index.js";
import { ApiError } from "../utils/apiError.js";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
    return callback(new ApiError(400, "Only jpg, png and webp images are allowed"));
  }

  callback(null, true);
};

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
  fileFilter,
}).single(UPLOAD_FIELD_NAME);
