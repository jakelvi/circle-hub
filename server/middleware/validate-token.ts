import { RequestHandler, Request } from "express";
import { auth } from "./service/auth-servise";
import { User } from "../database/model/user";
import { ErrorsMes } from "../error/ErrorMessages";
import { Logger } from "../logs/logger";

const extractToken = (req: Request) => {
  try {
    const authHeader = req.header("Authorization");
    if (
      authHeader &&
      authHeader.length > 7 &&
      authHeader.toLowerCase().startsWith("bearer ")
    ) {
      return authHeader.substring(7);
    }
  } catch (error) {
    Logger.error("Error extracting token:", error.message);
    throw new ErrorsMes("token is missing in Authorization header", 400);
  }
};

const validateToken: RequestHandler = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new Error("Token not found");
    }

    const { username } = auth.verifyJWT(token);
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User does not exist");
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("Error in validateToken middleware:", e.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export { validateToken };
