//User
import { ObjectId } from "mongoose";

type IName = {
  first: string;
  middle?: string;
  last: string;
  _id?: false;
};

type IUpdateName = {
  first?: string;
  middle?: string;
  last?: string;
  _id?: false;
};

type INewUser = {
  name: IName;
  username: string;
  bio?: string;
  profileImage?: string;
  email: string;
  posts?: string[];
  password: string;
  isAdmin?: boolean;
  _id?: string;
  createdAt?: Date;
  following?: string[];
  followers?: string[];
};

type IUpdateUser = {
  name: IUpdateName;
  username: string;
  bio?: string;
  profileImage?: string;
  id?: false;
};

type ILogin = {
  email?: string;
  username?: string;
  password: string;
};

type IJWTPayload = {
  username: string;
};

export { IName, ILogin, IJWTPayload, INewUser, IUpdateUser, IUpdateName };
