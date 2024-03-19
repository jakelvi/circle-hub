import mongoose from "mongoose";
import { OTPSchema } from "../schema/otp-schema";

const UserOtp = mongoose.model("otp", OTPSchema);

export { UserOtp };
