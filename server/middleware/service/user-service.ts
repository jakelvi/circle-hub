import { ILogin, INewUser, IUpdateUser } from "../../@types/user";
import { User } from "../../database/model/user";
import { auth } from "./auth-servise";
import { ErrorsMes } from "../../error/ErrorMessages";

interface IUser extends INewUser {
  id: string;
}

export const createUser = async (userData: INewUser): Promise<IUser> => {
  const user = new User(userData);
  user.password = await auth.hashPassword(user.password);
  const savedUser = await user.save();
  const userObject = savedUser.toObject();
  const userWithId: IUser = {
    ...userObject,
    id: userObject._id.toString(),
  };
  delete userWithId._id;
  return userWithId;
};

export const userUpdate = async (userId: string, newData: IUpdateUser) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, newData, {
      new: true,
    });

    return updatedUser;
  } catch (error) {
    throw new ErrorsMes(`Failed to update user: ${error.message}`, 400);
  }
};

export const validateUser = async ({ email, username, password }: ILogin) => {
  try {
    if (!email && !username) {
      throw new ErrorsMes("Provide email or username", 400);
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      throw new ErrorsMes("User not found", 404);
    }
    const isPasswordValid = await auth.validatePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ErrorsMes("Bad credentials", 401);
    }

    const jwt = auth.generateJWT({
      username: user.username,
    });

    return jwt;
  } catch (error) {
    throw error;
  }
};
