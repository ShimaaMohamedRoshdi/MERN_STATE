import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verfiyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get('/:id',verifyToken,getUser)

export default router;

// req: the data that take from the client side
// res: the data that take from the server side
