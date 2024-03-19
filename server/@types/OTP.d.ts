import { ObjectId } from "mongoose";

type IOTP = {
  otp: string;
  _id?: false;
};

type IDOTP = {
  otp: IOTP;
  createdAt: Date;
};

export { IDOTP };
