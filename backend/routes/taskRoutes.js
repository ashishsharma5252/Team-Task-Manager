import express from "express";
import { createTask, getTasks, updateTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only Admin can create task
router.post("/", protect, authorizeRoles("admin"), createTask);

// Both can view tasks
router.get("/", protect, getTasks);

// Only Member can update task status
router.put("/:id", protect, authorizeRoles("member"), updateTask);

export default router;