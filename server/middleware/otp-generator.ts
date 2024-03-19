//OTP-generate.ts
import { UserOtp } from "../database/model/otp";
import { auth } from "./service/auth-servise";
import { ErrorsMes } from "../error/ErrorMessages";
import { RequestHandler } from "express";
import CustomResponse from "./service/state-service";
import schedule from "node-schedule";
import { Logger } from "../logs/logger";

const createOTP: RequestHandler = async (req, res: CustomResponse, next) => {
  try {
    const { id } = req.params;
    const generatedOTP = auth.generateOTP();
    const savedOTP = await new UserOtp({ otp: generatedOTP }).save();
    Logger.info("Saved OTP:", savedOTP);

    res.generatedOTP = generatedOTP;
    res.id = id;

    const israelTimeZone = "Asia/Jerusalem";
    const israelDateTime = new Intl.DateTimeFormat("en-US", {
      timeZone: israelTimeZone,
    }).format(new Date());

    const job = schedule.scheduleJob(israelDateTime, async () => {
      try {
        await UserOtp.findOneAndDelete({ otp: generatedOTP });
        Logger.info("OTP deleted after 1 minute:", generatedOTP);
      } catch (error) {
        Logger.error("Error deleting OTP:", error);
      }
    });

    res.on("finish", () => {
      if (job) {
        job.cancel();
      }
    });

    next();
  } catch (error) {
    Logger.error("Error in createOTP middleware:", error);
    next(error);
  }
};

const verifyOTP: RequestHandler = async (req, res, next) => {
  try {
    const { otp } = req.body;
    Logger.info("Received OTP code:", otp);
    const otpDocument = await UserOtp.findOne({ otp });
    Logger.info("OTP Document from DB:", otpDocument);
    if (!otpDocument) {
      throw new ErrorsMes("User does not exist", 401);
    }
    await UserOtp.findByIdAndDelete(otpDocument._id);
    Logger.success("OTP deleted successfully", otpDocument.otp);
    res
      .status(201)
      .json({ msg: "OTP deleted successfully", deletedOTP: otpDocument.otp });
  } catch (error) {
    Logger.error("Error verifying OTP:", error);
    next(error);
  }
};

export { verifyOTP, createOTP };
