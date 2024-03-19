//error-handler.ts

import { ErrorRequestHandler } from "express";
import { ErrorsMes } from "../error/ErrorMessages";
import { Logger } from "../logs/logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  Logger.error(err);
  if (err instanceof ErrorsMes) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.code && err.code == 11000 && err.keyPattern && err.keyValue) {
    return res.status(400).json({
      message: "Duplicate Key",
      prpperty: err.keyValue,
      index: err.keyPattern,
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: "Invalid Json" });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};

export { errorHandler };
