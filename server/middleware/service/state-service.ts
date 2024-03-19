import { Response } from "express";

interface CustomResponse extends Response {
  generatedOTP?: string;
  id?: string;
}

export default CustomResponse;
