import { Schema } from "mongoose";
import { INewUser } from "../../@types/user";
import { nameSchema } from "./name-schema";

const register = new Schema<INewUser>({
  name: nameSchema,
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 7,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 100,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
  profileImage: {
    type: String,
    required: false,
    default: "",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: "",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "",
    },
  ],
});

export { register };
