import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosAuth;