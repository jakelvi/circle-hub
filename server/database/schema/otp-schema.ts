import { Schema } from "mongoose";
import { IDOTP } from "../../@types/OTP";

const OTPSchema = new Schema<IDOTP>({
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export { OTPSchema };
