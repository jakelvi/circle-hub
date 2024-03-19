import mongoose from "mongoose";
import { register } from "../schema/user-schema";

const User = mongoose.model("user", register);

export { User };
