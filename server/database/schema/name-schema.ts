import { Schema } from "mongoose";
import { IName } from "../../@types/user";

const nameSchema = new Schema<IName>({
  first: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 20,
  },
  middle: {
    required: false,
    type: String,
    default: "",
  },
  last: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 20,
  },
  _id: false,
});

export { nameSchema };
