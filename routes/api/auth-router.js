import express from "express";
import authController from "../../controllers/auth-controller.js";
import {
  authenticate,
  isEmptyBody,
  isValidId,
  upload,
} from "../../middlewares/index.js";
import { validaterBody } from "../../decorators/index.js";
import {
  userSigninSchema,
  userSignupSchema,
  userSettingsSchema,
  // updateSubscriptionSchema,
  userEmailSchema,
} from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validaterBody(userSignupSchema),
  authController.signup
);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post(
  "/verify",
  isEmptyBody,
  validaterBody(userEmailSchema),
  authController.resendVerify
);

authRouter.post(
  "/login",
  isEmptyBody,
  validaterBody(userSigninSchema),
  authController.signin
);
authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/settings",
  authenticate,
  validaterBody(userSettingsSchema),
  authController.settings
);
authRouter.get(
  "/forgetpassword",
  isEmptyBody,
  // validateBody(userSinginSchema),
  authController.forgetPassword
);
authRouter.patch(
  "/recovery",
  isEmptyBody,
  // validateBody(userSinginSchema),
  authController.recovery
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
