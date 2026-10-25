import express from "express";
import {
  signInController,
  signUpController,
} from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/ratelimitMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { signinSchema, signupSchema } from "../validation/authValidation.js";

const router = express.Router();

router
  .route("/signup")
  .post(authRateLimiter, validate(signupSchema), signUpController);
router
  .route("/signin")
  .post(authRateLimiter, validate(signinSchema), signInController);

export default router;
