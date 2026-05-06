import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await API.get("/dashboard");
      setData(res.data);
    };
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-bold">
            {user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
          </h2>
          <p className="text-sm opacity-90">
            Task insights and performance overview
          </p>
        </div>

        {/* CARDS */}
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Tasks" value={data.total} color="blue" />
            <Card title="Completed" value={data.completed} color="green" />
            <Card title="Pending" value={data.pending} color="red" />
            <Card title="In Progress" value={data.inProgress} color="yellow" />
            <Card title="Overdue" value={data.overdue} color="purple" />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const styles = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-400 to-yellow-500",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className={`bg-linear-to-r ${styles[color]} text-white p-6 rounded-xl shadow`}>
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;