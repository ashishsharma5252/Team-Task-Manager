import { useEffect, useState } from "react";
import API from "../services/api";

function Projects() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    members: [],
  });

  /* ================= FETCH ================= */

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  /* ================= MEMBERS SELECT ================= */

  const handleMembersChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (opt) => opt.value
    );
    setForm({ ...form, members: selected });
  };

  /* ================= CREATE PROJECT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/projects", form);

    setForm({ title: "", description: "", members: [] });
    fetchProjects();
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* HEADER */}
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm opacity-90">
            Manage your team projects
          </p>
        </div>

        {/* CREATE PROJECT (ADMIN ONLY) */}
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* MEMBERS MULTI SELECT */}
              <select
                multiple
                value={form.members}
                onChange={handleMembersChange}
                className="w-full p-2 border rounded h-28"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
                Create Project
              </button>
            </form>
          </div>
        )}

        {/* PROJECT LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* TITLE */}
              <h4 className="font-bold text-lg">{p.title}</h4>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mb-3">
                {p.description}
              </p>

              {/* MEMBERS (🔥 FIXED PART) */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Members:
                </p>

                <div className="flex flex-wrap gap-1">
                  {p.members?.map((m) => (
                    <span
                      key={m._id}
                      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Projects;