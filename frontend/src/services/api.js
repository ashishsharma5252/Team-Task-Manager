import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-1dc0.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token); // 👈 add this
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;