import Joi from "joi";

const validation = (schema: Joi.ObjectSchema, usersInput: any) => {
  const { error } = schema.validate(usersInput);
  if (!error) {
    return null;
  }

  const { message, path } = error.details[0];
  return { message, path };
};

export default validation;
