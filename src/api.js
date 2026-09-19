import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://sitebase-server.onrender.com/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const API_BASE_URL = API.defaults.baseURL;

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  },
);

export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const verifyAdmin = (adminId) =>
  API.post("/admin/verify", null, { headers: { "X-Admin-ID": adminId } });
export const updateProject = (id, data, adminId) =>
  API.put(`/projects/${id}`, data, { headers: { "X-Admin-ID": adminId } });
export const deleteProject = (id, adminId) =>
  API.delete(`/projects/${id}`, { headers: { "X-Admin-ID": adminId } });

export default API;
