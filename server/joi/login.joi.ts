import Joi from "joi";
import { passwordRegex } from "./regex";
import { ILogin } from "../@types/user";

const schema = Joi.object<ILogin>({
  email: Joi.alternatives().try(Joi.string().email(), Joi.string()),
  username: Joi.string(),
  password: Joi.string().pattern(passwordRegex).required(),
})
  .or("email", "username")
  .xor("email", "username");
export { schema as joiLoginSchema };
