import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.ts";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth);

export default router;
