import { Router } from "express";

import {
  logout,
  refresh,
  register,
  login,
  me,
  verifyEmail,
  resendVerificationOtp,
  updateProfile,
  uploadAvatarController,
  forgotPassword,
  resetPassword
} from "../controller/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validator/auth.validator.js";

import { validate } from "../middleware/validate.middleware.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationOtp);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", authenticate, me);

router.patch("/update-profile", authenticate, validate(updateProfileSchema), updateProfile);

router.post("/avatar", authenticate, uploadAvatar.single("avatar"), uploadAvatarController);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
