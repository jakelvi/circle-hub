import { joiLoginSchema } from "../../joi/login.joi";
import { joiPostSchema, joiPostUpdateSchema } from "../../joi/post.joi";
import {
  joiProfileImageSchema,
  joiRegisterSchema,
  joiUpdateSchema,
} from "../../joi/user.joi";
import { validateSchema } from "./validate-schema";

export const validateUserRegistration = validateSchema(joiRegisterSchema);
export const validateLogin = validateSchema(joiLoginSchema);
export const validateUserUpdate = validateSchema(joiUpdateSchema);
export const validateProfileImage = validateSchema(joiProfileImageSchema);
export const validatePostCreation = validateSchema(joiPostSchema);
export const validateUpdatePost = validateSchema(joiPostUpdateSchema);
