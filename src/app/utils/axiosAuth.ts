import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true, // 🔥 WAJIB
});

export default axiosAuth;
