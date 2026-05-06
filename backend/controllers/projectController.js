import Project from "../models/Project.js";

// Create Project (Admin)
export const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      members,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Projects (User)
export const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let projects;

    // 🔥 ADMIN → sees all projects
    if (role === "admin") {
      projects = await Project.find()
        .populate("members", "name email");
    }

    // 🔥 MEMBER → sees only projects where they are a member
    else {
      projects = await Project.find({
        members: userId,
      }).populate("members", "name email");
    }

    res.json(projects);
  } catch (error) {
    console.error("GET_PROJECTS_ERROR:", error);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};
