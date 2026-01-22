import axios, { AxiosResponse, AxiosHeaders } from "axios";
import { endpoints } from "@/config";

const API_URL = endpoints.auth;
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

// Remove trailing /api from BASE_URL if present to avoid duplication
const CLEAN_BASE_URL = BASE_URL.endsWith("/api")
  ? BASE_URL.slice(0, -4)
  : BASE_URL;

axios.defaults.baseURL = CLEAN_BASE_URL;

// Determine if CSRF protection should be enabled (disabled only in development)
const isDevelopment = import.meta.env.MODE === "development";
const enableCsrfProtection = !isDevelopment;

// CRITICAL: Enable credentials for cross-origin requests (CSRF tokens)
axios.defaults.withCredentials = true;

// Add CORS headers configuration
axios.defaults.headers.common["Access-Control-Allow-Credentials"] = "true";
axios.defaults.headers.common["Access-Control-Allow-Headers"] =
  "Content-Type, Authorization, X-XSRF-TOKEN";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE, PATCH, OPTIONS";

// Store CSRF token in memory
let csrfTokenCache: string | null = null;

// Helper function to read cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Helper to extract CSRF token from response headers
export function extractCsrfTokenFromResponse(
  response: AxiosResponse,
): string | null {
  if (!enableCsrfProtection) return null;

  let headerToken = response.headers["x-csrf-token"] as string | undefined;

  // Check if the header contains a JSON object (backend sends CSRF object)
  if (headerToken) {
    try {
      const csrfObject = JSON.parse(headerToken);
      if (csrfObject?.token) {
        headerToken = csrfObject.token;
      }
    } catch {
      // Header is already a plain token string, not JSON
    }

    if (headerToken) {
      csrfTokenCache = headerToken;
      localStorage.setItem("csrfToken", headerToken);
      return headerToken;
    }
  }

  return null;
}

// Function to fetch CSRF token from dedicated endpoint
export async function fetchCsrfToken(): Promise<string | null> {
  if (!enableCsrfProtection) return null;

  try {
    const response = await axios.get("/api/csrf-token", {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    // Extract from response header (primary source)
    let headerToken = response.headers["x-csrf-token"] as string | undefined;

    if (headerToken) {
      // Check if the header contains a JSON object
      try {
        const csrfObject = JSON.parse(headerToken);
        if (csrfObject?.token) {
          headerToken = csrfObject.token;
        }
      } catch {
        // Header is already a plain token string
      }

      if (headerToken) {
        csrfTokenCache = headerToken;
        localStorage.setItem("csrfToken", headerToken);
        return headerToken;
      }
    }

    // Fallback to response body
    const bodyToken = response.data?.token || response.data?._csrf;
    if (bodyToken) {
      csrfTokenCache = bodyToken;
      localStorage.setItem("csrfToken", bodyToken);
      return bodyToken;
    }
  } catch (error) {
    console.warn("Failed to fetch CSRF token from endpoint:", error);
  }

  return null;
}

// Helper to get CSRF token from multiple sources
function getCsrfToken(): string | null {
  if (!enableCsrfProtection) return null;

  // 1. Check memory cache first
  if (csrfTokenCache) return csrfTokenCache;

  // 2. Check localStorage
  const storedToken = localStorage.getItem("csrfToken");
  if (storedToken) {
    csrfTokenCache = storedToken;
    return storedToken;
  }

  // 3. Check cookies (HttpOnly cookies set by backend)
  const cookieToken = getCookie("XSRF-TOKEN") || getCookie("_csrf");
  if (cookieToken) {
    csrfTokenCache = cookieToken;
    localStorage.setItem("csrfToken", cookieToken);
    return cookieToken;
  }

  return null;
}

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    // 1. For refresh-token endpoint, send refreshToken in Authorization header
    if (config.url?.includes("/refresh-token")) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
      return config;
    }

    // 2. For all other endpoints, send access token in Authorization header
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Handle CSRF token for POST, PUT, DELETE, PATCH requests (only in non-development environments)
    if (enableCsrfProtection) {
      if (
        config.method &&
        ["post", "put", "delete", "patch"].includes(config.method.toLowerCase())
      ) {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers["X-XSRF-TOKEN"] = csrfToken;
        } else {
          console.warn(
            "CSRF Token not found. Request may fail on protected endpoints.",
          );
        }
      }
    }

    // 4. Send language preference with every request
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.preferredLanguage) {
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers["Accept-Language"] = parsedUser.preferredLanguage;
        }
      } catch (e) {
        console.warn("Failed to parse user from localStorage:", e);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => {
    // Extract CSRF token from response headers (especially important for login)
    if (enableCsrfProtection) {
      try {
        extractCsrfTokenFromResponse(response);
      } catch (csrfError) {
        console.error("Error extracting CSRF token:", csrfError);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      console.error("No originalRequest config found:", error);
      return Promise.reject(error);
    }

    // Handle 403 Forbidden - possible CSRF token expiration
    if (
      error.response?.status === 403 &&
      !originalRequest._retryForbidden &&
      enableCsrfProtection
    ) {
      originalRequest._retryForbidden = true;

      try {
        // Attempt to fetch a new CSRF token
        await fetchCsrfToken();

        // Retry the original request with new token
        const newCsrfToken = getCsrfToken();
        if (newCsrfToken) {
          originalRequest.headers["X-XSRF-TOKEN"] = newCsrfToken;
          return axios(originalRequest);
        }
      } catch (csrfError) {
        console.error("Failed to refresh CSRF token:", csrfError);
        return Promise.reject(csrfError);
      }
    }

    // Check if error is 401 and we haven't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes(`${API_URL}/refresh-token`)
    ) {
      // If this is a login request, don't try to refresh - return the actual 401 error
      if (originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("No refresh token found in localStorage");
          throw new Error("No refresh token available");
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_URL}/refresh-token`, {});

        const responseData = response?.data;

        if (!responseData) {
          console.error("No data in refresh token response:", response);
          throw new Error("Invalid refresh token response");
        }

        // Handle response structure - backend returns object directly, not wrapped
        const token = responseData?.token;
        const newRefreshToken = responseData?.refreshToken;

        if (!token) {
          console.error("No token in auth response:", responseData);
          throw new Error("No token in refresh response");
        }

        localStorage.setItem("token", token);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Update header and retry request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("REFRESH TOKEN FAILED:", {
          errorMessage:
            refreshError instanceof Error
              ? refreshError.message
              : String(refreshError),
          stack: refreshError instanceof Error ? refreshError.stack : undefined,
        });

        // Refresh failed - clear session and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("csrfToken");

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

    // Log network errors with more details
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network error detected:", {
        message: error.message,
        code: error.code,
        url: originalRequest?.url,
        baseURL: originalRequest?.baseURL,
        method: originalRequest?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
    }

    return Promise.reject(error);
  },
);

export default axios;
