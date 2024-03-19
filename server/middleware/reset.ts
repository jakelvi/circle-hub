//reset.ts
import { User } from "../database/model/user";
import { RequestHandler } from "express";
import { ErrorsMes } from "../error/ErrorMessages";
import bcrypt from "bcrypt";
import { Logger } from "../logs/logger";
import { passwordRegex } from "../joi/regex";

const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(id);

    if (!user) {
      throw new ErrorsMes("User not found", 404);
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new ErrorsMes(
        "Old password, new password, and confirm password are required",
        400
      );
    }
    if (!newPassword.match(passwordRegex)) {
      throw new ErrorsMes(
        "Invalid password format. Password must meet the specified criteria.",
        400
      );
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new ErrorsMes("Invalid old password", 401);
    }

    if (newPassword !== confirmPassword) {
      throw new ErrorsMes(
        "New password and confirm password do not match",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    await user.save();

    res.status(201).send({ msg: "Password updated successfully" });
    next();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({ msg: error.message });
    next();
  }
};

export default resetPassword;

const resetEmail: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newEmail, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new ErrorsMes("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorsMes("Invalid password", 401);
    }

    await User.findByIdAndUpdate(id, { email: newEmail });

    return res.status(201).send({ msg: "Email updated successfully" });
  } catch (error) {
    Logger.error(error);
    next();
  }
};

export { resetPassword, resetEmail };
