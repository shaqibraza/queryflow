import { Router } from "express";
import { logout, refresh, register, login, me } from "../controller/auth.controller.js";
import { registerSchema, loginSchema } from "../validator/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.get("/me", authenticate, me);

export default router;
