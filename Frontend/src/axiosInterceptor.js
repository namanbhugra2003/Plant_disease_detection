import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ❌ If no token, redirect to login
    if (!user || !user.token) {
      window.location.href = "/login";
      return Promise.reject("No auth token");
    }

    // ✅ Attach token
    config.headers.Authorization = `Bearer ${user.token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle expired / invalid token
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
