import { RequestHandler } from "express";
import { User } from "../database/model/user";
import { extractToken } from "./is-admin";
import { auth } from "./service/auth-servise";
import { ErrorsMes } from "../error/ErrorMessages";

const isAdminOrUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const { username } = auth.verifyJWT(token);

    const user = await User.findOne({ username });

    if (!user) {
      throw new ErrorsMes("User does not exist", 401);
    }

    if (id === user.id) {
      return next();
    }

    if (user.isAdmin) {
      return next();
    }

    res
      .status(401)
      .json({ message: "Only admin/The id must belong to the user" });
  } catch (e) {
    next(e);
  }
};

export { isAdminOrUser };
