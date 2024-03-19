import { Schema } from "mongoose";
import { INewPost } from "../../@types/posts";

const postSchema = new Schema<INewPost>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  id: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  caption: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    minlength: 0,
    maxlength: 255,
    required: false,
    default: "",
  },
  tags: {
    type: [String],
    required: false,
    default: [],
  },
  image: {
    type: String,
    required: false,
    default: "",
  },
  likes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        _id: false,
      },
    },
  ],
  favorites: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        _id: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export { postSchema };
