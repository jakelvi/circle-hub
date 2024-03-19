import { Request, Response, NextFunction } from "express";

const staticLogger = (req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith("/uploads")) {
    console.log(`Static file served: ${req.url}`);
  }

  next();
};

export default staticLogger;
