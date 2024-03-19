import mongoose from "mongoose";
import { postSchema } from "../schema/post-schema";
const Post = mongoose.model("post", postSchema);

export { Post };
