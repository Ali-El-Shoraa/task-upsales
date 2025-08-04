// /controllers/uploadController.ts

import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import cloudinary from "../libs/cloudinary";

// إعداد multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = [
  upload.single("file"), // اسم الحقل في FormData
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // تحويل buffer إلى base64
      const file64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(file64, {
        folder: "movies", // اسم مجلد Cloudinary (اختياري)
      });

      return res.status(200).json({
        message: "Image uploaded successfully",
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({ message: "Failed to upload image" });
    }
  },
];
