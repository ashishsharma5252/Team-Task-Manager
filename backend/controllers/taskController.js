import Task from "../models/Task.js";

// Create Task (Admin)
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, deadline } = req.body;

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      deadline,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tasks
export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      // ✅ admin sees all
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("projectId", "title");
    } else {
      // ✅ member sees only their tasks
      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate("assignedTo", "name email")
        .populate("projectId", "title");
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Status (Member)
export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Only restrict MEMBER
    if (req.user.role !== "admin") {
      if (task.assignedTo.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "You can only update your own tasks",
        });
      }
    }

    // ✅ Validate status
    const allowedStatus = ["pending", "in-progress", "completed"];

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    task.status = req.body.status;

    await task.save();

    res.json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: error.message });
  }
};
