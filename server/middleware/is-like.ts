import { RequestHandler } from "express";
import { ErrorsMes } from "../error/ErrorMessages";
import { extractToken } from "./is-admin";
import { auth } from "./service/auth-servise";
import { User } from "../database/model/user";
import { INewUser } from "../@types/user";
import { isValidObjectId } from "mongoose";
import { Post } from "../database/model/posts";

const isLike: RequestHandler = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const { username } = auth.verifyJWT(token);
    const user = (await User.findOne({ username }).lean()) as INewUser;
    const userId = user._id;

    const postId = req.params.id;

    const valid = isValidObjectId(postId);
    if (!valid) {
      throw new ErrorsMes("The Id is not type of ObjectId", 401);
    }

    const postExist = await Post.findById(postId);
    if (!postExist) throw new ErrorsMes("Post does not exist", 401);

    const { likes } = postExist;

    const likeIndex = likes.findIndex((like) => like.userId.equals(userId));

    if (likeIndex !== -1) {
      postExist.likes.splice(likeIndex, 1);
      const updatedPost = await postExist.save();
      res.json({ post: updatedPost });
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
};

export { isLike };
