import { RequestHandler } from "express";
import Mailgen from "mailgen";
import { User } from "../database/model/user";
import { ErrorsMes } from "../error/ErrorMessages";
import CustomResponse from "./service/state-service";
import { createTransporter, myEmail } from "./service/mail-service";
import { Logger } from "../logs/logger";

const sendRegisteredEmail: RequestHandler = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    if (!username || !email) {
      throw new ErrorsMes(
        "Username and email are required for sending emails.",
        400
      );
    }
    const transporter = createTransporter();
    const mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "SocialGram",
        link: "https://localhost:5173/",
      },
    });

    const emailMessage = {
      body: {
        name: username,
        outro:
          "I'm happy you joined us and hope you will have excellent time in Social Gram",
      },
    };

    const emailBody = mailGenerator.generate(emailMessage);

    const message = {
      from: myEmail,
      to: email,
      subject: "Registration complete",
      html: emailBody,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        return next(err);
      }
      next();
    });
  } catch (error) {
    Logger.error(error);
    next(error);
  }
};

const sendOTPEmail: RequestHandler = async (req, res: CustomResponse, next) => {
  try {
    const { id, generatedOTP: otp } = res;
    const user = await User.findById(id);
    if (!user) {
      throw new ErrorsMes("User not found", 404);
    }
    const email = user.email;
    const username = user.username;
    const transporter = createTransporter();
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "SocialGram",
        link: "https://localhost:5173/",
      },
    });

    const emailMessage = {
      body: {
        name: username,
        intro: "Hello! Your OTP code is on its way.",
        outro: `Use this code to complete your operation. Do not share it with others. ${otp},`,
      },
    };

    const emailBody = mailGenerator.generate(emailMessage);

    const message = {
      from: "halevyworks@gmail.com",
      to: email,
      subject: "OTP Code",
      html: emailBody,
    };
    Logger.success("OTP email sent successfully to:", email);
    await transporter.sendMail(message);
    return res.status(201).send({ msg: "OTP was sent to users email" });
  } catch (error) {
    Logger.error("Error sending OTP email:", error);
  }
  next();
};

export { sendRegisteredEmail, sendOTPEmail };
