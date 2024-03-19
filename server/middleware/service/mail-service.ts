// mail-service.ts
import nodemailer from "nodemailer";

const myEmail = process.env.USER;

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "halevyworks@gmail.com",
      pass: "flalgbtxyxgvgqbw",
    },
  });
};

export { createTransporter, myEmail };
