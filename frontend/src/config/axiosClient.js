import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      token = token.replace(/^"|"$/g, "").trim();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }

    if (status === 500) {
      console.error("Server error:", error?.response?.data);
    }

    if (!error.response) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
