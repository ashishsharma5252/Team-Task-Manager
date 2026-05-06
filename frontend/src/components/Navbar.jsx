import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // common style function
  const linkStyle = ({ isActive }) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      
      <h1 className="text-xl font-bold">Task Manager</h1>

      <div className="flex items-center gap-6">

        {/* Links with highlight */}
        <NavLink to="/dashboard" className={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/projects" className={linkStyle}>
          Projects
        </NavLink>

        <NavLink to="/tasks" className={linkStyle}>
          Tasks
        </NavLink>

        {/* User Info */}
        <div className="flex items-center gap-3 border-l border-gray-700 pl-4">
          
          <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;