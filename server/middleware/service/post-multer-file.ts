import { RequestHandler } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const renameAsync = promisify(fs.rename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/postUploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${ext}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage: storage });
