import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    // 1. Get token from localStorage (this happens immediately before every request)
    const token = localStorage.getItem("token");

    // 2. If token exists, attach it to headers
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. (Optional) If you need to send language with every request
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.preferredLanguage) {
        config.headers["Accept-Language"] = parsedUser.preferredLanguage;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") // Prevent infinite loop on refresh endpoint
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh token
        // Note: Adjust the endpoint URL '/auth/refresh-token' to match your backend
        const { data } = await axios.post("/auth/refresh-token", {
          refreshToken,
        });

        // Handle response structure (adjust if your API returns data differently)
        const authData = data.data || data;
        const { token, refreshToken: newRefreshToken } = authData;

        if (token) {
          localStorage.setItem("token", token);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Update header and retry request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear session and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        const baseUrl = import.meta.env.BASE_URL.endsWith("/")
          ? import.meta.env.BASE_URL
          : `${import.meta.env.BASE_URL}/`;
        const loginPath = `${baseUrl}login`;

        if (!window.location.pathname.includes("/login")) {
          window.location.href = loginPath;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
