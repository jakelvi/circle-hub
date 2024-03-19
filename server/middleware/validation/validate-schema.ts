import { RequestHandler } from "express";
import { ObjectSchema, ValidationError } from "joi";
import { Logger } from "../../logs/logger";

type ValidateSchema = (schema: ObjectSchema) => RequestHandler;

const validateSchema: ValidateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (!error) {
    return next();
  }

  if (error instanceof ValidationError) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    Logger.error("Validation Error:", errorMessage);
    return res.status(400).json({ error: errorMessage });
  }

  if (typeof error === "string") {
    Logger.error("Validation Error:", error);
    return res.status(400).json({ error });
  }

  Logger.error("Unknown Validation Error:", JSON.stringify(error));
  res.status(500).json({ error: "Internal Server Error" });
};

export { validateSchema };
