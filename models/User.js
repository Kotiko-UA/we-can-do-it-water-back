import { Schema, model } from 'mongoose';
import { handleSaveError, preUpdate } from './hooks.js';
import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const userShema = new Schema(
  {
    name: {
      type: String,
      default: 'User',
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minLength: 6,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [emailRegexp, 'Please fill a valid email address'],
      unique: true,
    },
    gender: {
      type: String,
      enum: ['girl', 'men'],
      default: 'girl',
    },
    avatarURL: {
      type: String,
      required: true,
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

userShema.post('save', handleSaveError);

userShema.pre('findOneAndUpdate', preUpdate);

userShema.post('findOneAndUpdate', handleSaveError);

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `missing required name field`,
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': `"Password" cannot be an empty field`,
    'any.required': `"Password" is a required field`,
  }),
  repeatPassword: Joi.string().required().min(6).messages({
    'string.empty': `"RepeatPassword" cannot be an empty field`,
    'any.required': `"RepeatPassword" is a required field`,
  }),
});

export const userSigninSchema = Joi.object({
  password: Joi.string().required().min(6).messages({
    'string.empty': `"Password" cannot be an empty field`,
    'any.required': `"Password" is a required field`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `missing required name field`,
  }),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `missing required name field`,
  }),
});
export const userSettingsSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().pattern(emailRegexp).messages({
    'any.required': `missing required name field`,
  }),
  newPassword: Joi.string().min(6),
  gender: Joi.string().valid('girl', 'men'),
  avatar: Joi.string(),
});

const User = model('user', userShema);

export default User;
