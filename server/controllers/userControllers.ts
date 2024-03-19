import { RequestHandler } from "express";
import {
  createUser,
  userUpdate,
  validateUser,
} from "../middleware/service/user-service";
import { IJWTPayload, ILogin, INewUser, IUpdateUser } from "../@types/user";
import { Logger } from "../logs/logger";
import { User } from "../database/model/user";
import { auth } from "../middleware/service/auth-servise";
import deleteImages from "../middleware/service/delete-multer-images";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const saved = await createUser(req.body as INewUser);

    Logger.success(`User saved successfully, ${saved}`);
    return res.status(201).json({ message: "Saved", user: saved });
  } catch (error) {
    Logger.error(error);
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body as ILogin;

    const jwt = await validateUser({ email, username, password });

    Logger.success("Login was successful");
    return res.status(200).json({ message: "Logged in", jwt: jwt });
  } catch (error) {
    Logger.error(error);
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...rest } = user;
    return res.json({ user: rest });
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
      delete user.password;
    }
    Logger.success("User was retrieved successfully");
    res.status(200).json({ user });
  } catch (error) {
    Logger.error("Error fetching user by id:", error);
    next(error);
  }
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    let query = User.find();

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;

    if (limit > 0) {
      query = query.limit(limit);
    }
    const allUsers = await query.exec();
    Logger.success(200, "All users retrieved successfully");
    return res
      .status(200)
      .json({ msg: "All users received successfully", allUsers });
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToUpdate = req.body as IUpdateUser;

    const savedUpdate = await User.findByIdAndUpdate(id, userToUpdate, {
      new: true,
    });

    if (!savedUpdate) {
      return res.status(404).json({ msg: "Updated user was not found" });
    }

    const profileImagePath = req.body.profileImage;
    const usernameUpdated =
      req.body.username && req.body.username !== savedUpdate.username;

    if (profileImagePath && savedUpdate.profileImage) {
      deleteImages(savedUpdate.profileImage);
    }

    let newToken = null;
    if (usernameUpdated) {
      const payload: IJWTPayload = {
        username: savedUpdate.username,
      };
      newToken = auth.generateJWT(payload);
    }

    return res.status(200).json({
      msg: "User was updated successfully",
      updatedUser: savedUpdate.toObject(),
      newToken: newToken,
    });
  } catch (e) {
    console.error("Error updating user:", e);
    next(e);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findOneAndDelete({ _id: id });
    Logger.success(200, "User was deleted successfully");
    return res.status(200).json(`User was deleted successfully, ${deleteUser}`);
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};

export const followUserToggle: RequestHandler = async (req, res, next) => {
  try {
    const { followerId, followedId } = req.params;
    if (!followerId || !followedId) {
      return res
        .status(400)
        .json({ error: "Follower ID and followed ID are required" });
    }

    const followedUser = await User.findById(followedId);
    const followerUser = await User.findById(followerId);
    if (!followedUser || !followerUser) {
      Logger.error(404, "User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (followerUser.following.includes(followedId)) {
      await User.updateOne(
        { _id: followerId },
        { $pull: { following: followedId } }
      );
      await User.updateOne(
        { _id: followedId },
        { $pull: { followers: followerId } }
      );
      Logger.success(200, "Unfollowed successfull");
      return res
        .status(200)
        .json({ success: true, message: "Unfollowed successfully" });
    } else {
      await User.updateOne(
        { _id: followerId },
        { $addToSet: { following: followedId } }
      );
      await User.updateOne(
        { _id: followedId },
        { $addToSet: { followers: followerId } }
      );
      Logger.success(200, "Followed successfully");
      return res
        .status(200)
        .json({ success: true, message: "Followed successfully" });
    }
  } catch (e) {
    Logger.error(e);
    next(e);
  }
};
