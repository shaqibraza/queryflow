import { Router } from "express";

import {
  logout,
  refresh,
  register,
  login,
  me,
  verifyEmail,
  resendVerificationOtp,
  updateProfile
} from "../controller/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  updateProfileSchema
} from "../validator/auth.validator.js";

import { validate } from "../middleware/validate.middleware.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

router.post("/resend-verification", validate(resendVerificationSchema), resendVerificationOtp);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", authenticate, me);

router.patch("/update-profile", authenticate, validate(updateProfileSchema), updateProfile);

export default router;
