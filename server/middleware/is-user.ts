import { RequestHandler } from "express";
import { User } from "../database/model/user";
import { extractToken } from "./is-admin";
import { auth } from "./service/auth-servise";
import { INewUser } from "../@types/user";
import { ErrorsMes } from "../error/ErrorMessages";

const isUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);

    const decodedToken = auth.verifyJWT(token);

    const { username } = decodedToken;

    const user = (await User.findOne({ username }).lean()) as INewUser;

    if (!user) throw new ErrorsMes("User does not exist", 401);

    if (id === user?._id.toString()) return next();

    res.status(401).json({ message: "The id must belong to the user" });
  } catch (e) {
    next(e);
  }
};

export { isUser };
