import Task from "../models/Task.js";
import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {
    let tasks;

    // ✅ Handle both id/_id safely
    const userId = req.user._id || req.user.id;

    if (req.user.role === "admin") {
      // Admin → all tasks
      tasks = await Task.find();
    } else {
      // Member → only their tasks
      tasks = await Task.find({
        assignedTo: userId,
      });
    }

    const total = tasks.length;

    const completed = tasks.filter(
      (t) => t.status === "completed"
    ).length;

    const pending = tasks.filter(
      (t) => t.status === "pending"
    ).length;

    const inProgress = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;

    const overdue = tasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== "completed"
    ).length;

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};