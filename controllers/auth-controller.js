import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import cloudinary from "../helpers/cloudinary.js";

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password, repeatPassword } = req.body;

  const avatarURL = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);
  if (password !== repeatPassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({
    email,
    // ...req.body,
    avatarURL,
    password: hashPassword,
    verificationToken,
  });
  res.status(201).json({
    email: newUser.email,
    avatarURL,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click ferify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    avatarURL,
  });
};
const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click ferify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "Email send success",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const paylod = {
    id: user._id,
  };

  const token = jwt.sign(paylod, JWT_SECRET, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { email: user.email },
  });
};

const getCurrent = async (req, res) => {
  const { email, avatarURL } = req.user;
  res.json({
    email,
    avatarURL,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
};
const settings = async (req, res) => {
  const { email } = req.user;
  const { newPassword } = req.body;
  let { password } = req.user;
  // const { error } = User.userSettingsSchema.validate(req.body);
  // if (error) {
  //   throw HttpError(404, error.message);
  // }
  if (email === req.body.email) {
    throw HttpError(401, "Email in use");
  }

  password = newPassword ? await bcrypt.hash(newPassword, 10) : password;
  console.log(password);

  const result = await User.findOneAndUpdate(
    req.user._id,
    { ...req.body, password },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(result);
};

// const updateSubscription = async (req, res) => {
//   const { _id } = req.user;
//   await User.findByIdAndUpdate(_id, { subscription: req.body.subscription });
//   res.json({ message: "Subscription was updated" });
// };

const updateAvatar = async (req, res) => {
  console.log(req.file);

  if (!req.file) {
    throw HttpError(400, "No file");
  }
  const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
    folder: "avarars",
  });
  fs.unlink(req.file.path);
  await User.findByIdAndUpdate(req.user._id, {
    avatarURL,
  });
  res.json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  settings: ctrlWrapper(settings),
  // updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
