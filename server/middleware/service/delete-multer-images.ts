import fs from "fs";
import { Logger } from "../../logs/logger";

const deleteImages = async (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
    Logger.info("Old profile image deleted:", filePath);
  } catch (e) {
    Logger.error("Error deleting old profile image:", e);
  }
};

export default deleteImages;
