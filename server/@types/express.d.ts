import { Request } from "express";
import { INewUser } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: INewUser;
    }
  }
}
