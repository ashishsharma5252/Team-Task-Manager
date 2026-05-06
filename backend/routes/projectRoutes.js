import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only Admin can create project
router.post("/", protect, authorizeRoles("admin"), createProject);

// Both Admin & Member can view projects
router.get("/", protect, getProjects);

export default router;