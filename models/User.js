import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const userShema = new Schema(
  {
    name: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: 8,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      match: [emailRegexp, "Please fill a valid email address"],
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "female",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    dailyNorma: {
      type: Number,
      default: 2.0,
    },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
      //required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userShema.post("save", handleSaveError);

userShema.pre("findOneAndUpdate", preUpdate);

userShema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required name field`,
  }),
  password: Joi.string().required().min(8).messages({
    "string.empty": `"Password" cannot be an empty field`,
    "any.required": `"Password" is a required field`,
  }),
});

export const userSigninSchema = Joi.object({
  password: Joi.string().required().min(8).messages({
    "string.empty": `"Password" cannot be an empty field`,
    "any.required": `"Password" is a required field`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required name field`,
  }),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required name field`,
  }),
});
export const userSettingsSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().required().messages({
    "string.empty": `"Password" cannot be an empty field`,
    "any.required": `"Password" is a required field`,
  }),
  newPassword: Joi.string().min(8),
  gender: Joi.string().valid("male", "female"),
  avatar: Joi.string(),
});

export const userDailyNormaUpdateSchema = Joi.object({
  dailyNorma: Joi.number().required().messages({
    "string.empty": `"DailyNorma" cannot be an empty field`,
    "any.required": `"DailyNorma" is a required field`,
  }),
});

const User = model("user", userShema);

export default User;
