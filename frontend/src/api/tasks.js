import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5050/api/tasks" });
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// CRUD APIs
export const getTasks = () => API.get("/get");
export const addTask = (task) => API.post("/add", task);
export const updateTask = (id, task) => API.put(`/update/${id}`, task);
export const deleteTask = (id) => API.delete(`/delete/${id}`);

export const updateTaskStatus = (id, status) =>
  API.patch(`/update-status/${id}`, { status });
