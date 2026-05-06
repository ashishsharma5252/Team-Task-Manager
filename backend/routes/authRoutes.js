import express from "express";
import { signup, login } from "../controllers/authController.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/", protect, async (req, res) => {
  const users = await User.find().select("_id name email");
  res.json(users);
});

export default router;