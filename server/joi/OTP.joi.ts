import Joi from "joi";
import { IDOTP } from "../@types/OTP";

const schema = Joi.object<IDOTP>({
  otp: Joi.string().required(),
  createdAt: Joi.date().required(),
});

export { schema as joiOTPSchema };
