import { RequestHandler } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const renameAsync = promisify(fs.rename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/userUploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const uploadProfileImage = upload.single("file");

const handleFileUpload: RequestHandler = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  req.body.profileImage = `http://localhost:5000/userUploads/${req.file.filename}`;

  next();
};

export { uploadProfileImage, handleFileUpload };
