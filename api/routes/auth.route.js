import express from "express";
import {
  google_post,
  signin_post,
  signout_get,
  signup_post,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signup_post);
router.post("/signin", signin_post);
router.post("/google", google_post);
router.get("/signout", signout_get);

export default router;
