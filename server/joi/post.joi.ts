import Joi from "joi";
import { INewPost, IUpdatePost } from "../@types/posts";

const joiPostSchema = Joi.object<INewPost>({
  userId: Joi.string().required(),
  caption: Joi.string().min(2).max(50).required(),
  location: Joi.string().default(""),
  tags: Joi.array().items(Joi.string()),
  image: Joi.string().allow("").optional(),
});

const joiPostUpdateSchema = Joi.object<IUpdatePost>({
  userId: Joi.string().required(),
  id: Joi.string().required(),
  caption: Joi.string().min(2).max(50).required(),
  location: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  image: Joi.string().allow(""),
});

export { joiPostSchema, joiPostUpdateSchema };
