import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchData();
  }, []);

  /* ================= FETCH ================= */

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const fetchData = async () => {
    try {
      const [p, u] = await Promise.all([
        API.get("/projects"),
        API.get("/users"),
      ]);
      setProjects(p.data);
      setUsers(u.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  /* ================= CREATE TASK ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/tasks", form);

      toast.success("Task created successfully");

      setForm({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        deadline: "",
      });

      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (task, status) => {
    const assignedUserId =
      typeof task.assignedTo === "object"
        ? task.assignedTo._id
        : task.assignedTo;

    const currentUserId = user._id;

    console.log("assignedUserId:", assignedUserId);
    console.log("currentUserId:", currentUserId);

    // permission check
    if (
      user.role !== "admin" &&
      assignedUserId?.toString() !== currentUserId?.toString()
    ) {
      return toast.error("You can only update your own tasks");
    }

    try {
      await API.put(`/tasks/${task._id}`, { status });
      toast.success("Task updated successfully");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "in-progress") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* HEADER */}
        <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-sm opacity-90">
            {user.role === "admin"
              ? "Manage and assign tasks"
              : "Track and update your tasks"}
          </p>
        </div>

        {/* CREATE TASK (ADMIN ONLY) */}
        {user.role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-lg">
            <h3 className="font-semibold mb-4 text-lg">Create Task</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Task Title"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <input
                placeholder="Description"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* Project */}
              <select
                className="w-full p-2 border rounded"
                value={form.projectId}
                onChange={(e) =>
                  setForm({ ...form, projectId: e.target.value })
                }
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              {/* Assign User */}
              <select
                className="w-full p-2 border rounded"
                value={form.assignedTo}
                onChange={(e) =>
                  setForm({ ...form, assignedTo: e.target.value })
                }
                required
              >
                <option value="">Assign User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="w-full p-2 border rounded"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />

              <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded transition">
                {loading ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>
        )}

        {/* TASK LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            console.log("TASK assignedTo:", task.assignedTo);
            console.log("USER:", user._id);
            const assignedUserId = task.assignedTo?._id || task.assignedTo;

            const isOwner =
              user.role === "admin" ||
              assignedUserId?.toString() === user._id?.toString();

            return (
              <div
                key={task._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h4 className="font-bold text-lg">{task.title}</h4>

                <p className="text-sm text-gray-600 mb-2">
                  {task.description || "No description"}
                </p>

                <span
                  className={`px-2 py-1 text-xs rounded ${getStatusColor(
                    task.status,
                  )}`}
                >
                  {task.status}
                </span>

                {task.deadline && (
                  <p className="text-xs text-gray-500 mt-2">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                )}

                {/* BUTTONS */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {["pending", "in-progress", "completed"].map((s) => (
                    <button
                      key={s}
                      disabled={!isOwner}
                      onClick={() => updateStatus(task, s)}
                      className={`px-2 py-1 rounded text-sm transition ${
                        !isOwner
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : s === "completed"
                            ? "bg-green-200 hover:bg-green-300"
                            : s === "in-progress"
                              ? "bg-yellow-200 hover:bg-yellow-300"
                              : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {!isOwner && (
                  <p className="text-xs text-red-400 mt-2">
                    Not assigned to you
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No tasks available</p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
