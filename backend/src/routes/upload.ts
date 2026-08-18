import { Router } from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = Router();

router.use(requireAuth, requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "mebfactory" }, (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve(result.secure_url);
      });
      uploadStream.end(req.file!.buffer);
    });

    res.json({ url });
  } catch (err) {
    console.error("[upload] Cloudinary upload failed:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
