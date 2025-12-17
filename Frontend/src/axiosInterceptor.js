import axios from "axios";

axios.interceptors.response.use(
  // ✅ Agar response sahi hai, to bas return
  (response) => response,

  // ❌ Agar error aaya
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 🔐 Unauthorized / Forbidden
      if (status === 401 || status === 403) {
        // Token & user data hata do
        localStorage.removeItem("user");

        // Axios se auth header hata do
        delete axios.defaults.headers.common["Authorization"];

        // Login page pe redirect
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
