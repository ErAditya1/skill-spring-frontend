import axios from "axios";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:8000/api"
    : "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // VERY IMPORTANT for cookies
});

/* ---------------------------------- */
/* REQUEST INTERCEPTOR */
/* ---------------------------------- */

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const uniqueId = getUniqueId();
      if (uniqueId) {
        config.headers["X-Unique-ID"] = uniqueId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------------------- */
/* RESPONSE INTERCEPTOR */
/* ---------------------------------- */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint (cookie-based)
        await axios.patch(
          `${API_URL}/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* ---------------------------------- */
/* LOGOUT HANDLER */
/* ---------------------------------- */

function handleLogout() {
  if (typeof window !== "undefined") {
    // Optional: call backend logout endpoint
    axios.post(`${API_URL}/v1/users/logout`, {}, {
      withCredentials: true,
    });

    if (!window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth/sign-in";
    }
  }
}

/* ---------------------------------- */
/* UNIQUE ID HANDLER */
/* ---------------------------------- */

function getUniqueId() {
  if (typeof document === "undefined") return null;

  const cookieId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("uniqueId="));

  if (cookieId) {
    return cookieId.split("=")[1];
  }

  return localStorage.getItem("uniqueId");
}

export default api;
