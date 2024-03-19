import Joi from "joi";
import { IName, INewUser, IUpdateUser, IUpdateName } from "../@types/user";
import { passwordRegex } from "./regex";

const joiRegisterSchema = Joi.object<INewUser>({
  name: Joi.object<IName>({
    first: Joi.string().min(2).max(20).required(),
    middle: Joi.string().min(0).max(20).allow(""),
    last: Joi.string().min(2).max(30).required(),
  }).required(),
  username: Joi.string().min(4).max(20).required(),
  bio: Joi.string().min(5).max(2200).allow(""),
  email: Joi.string().email().min(5).max(255).required(),
  password: Joi.string().pattern(passwordRegex).min(5).max(20).required(),
  isAdmin: Joi.boolean(),
  posts: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().default(Date.now),
});

const joiProfileImageSchema = Joi.object({
  path: Joi.string().allow(""),
  mimetype: Joi.string().allow(""),
  size: Joi.number().allow(null),
}).allow(null);

const joiUpdateSchema = Joi.object<IUpdateUser>({
  name: Joi.object<IUpdateName>({
    first: Joi.string().min(2).max(20).optional(),
    middle: Joi.string().min(0).max(20).allow(""),
    last: Joi.string().min(2).max(30).optional(),
  }).required(),
  username: Joi.string().min(4).max(20),
  bio: Joi.string().min(5).max(2200).allow(""),
  profileImage: Joi.string().uri().allow(""),
});

export { joiRegisterSchema, joiUpdateSchema, joiProfileImageSchema };
