import axios, { AxiosResponse, AxiosHeaders } from "axios";
import { endpoints } from "@/config";
import {
  isTokenExpired,
  isValidTokenFormat,
  getTokenTimeRemaining,
} from "./jwt-utils";

// Get API base URL from environment variable - REQUIRED!
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!RAW_BASE_URL) {
  console.error(
    "CRITICAL ERROR: VITE_API_BASE_URL environment variable is not set!",
    {
      mode: import.meta.env.MODE,
      availableEnvKeys: Object.keys(import.meta.env).filter((key) =>
        key.startsWith("VITE_"),
      ),
    },
  );
  console.warn(
    "Falling back to development default: https://127.0.0.1:8030/api",
  );
}

const BASE_URL = RAW_BASE_URL || "https://127.0.0.1:8030/api";

// Remove trailing /api from BASE_URL if present to avoid duplication
const CLEAN_BASE_URL = BASE_URL.endsWith("/api")
  ? BASE_URL.slice(0, -4)
  : BASE_URL;

axios.defaults.baseURL = CLEAN_BASE_URL;
const API_URL = endpoints.auth;

// Enable CSRF protection for all environments since backend requires it
const isDevelopment = import.meta.env.MODE === "development";
const enableCsrfProtection = true; // Always enabled since backend requires CSRF tokens

// CRITICAL: Enable credentials for cross-origin requests (CSRF tokens)
axios.defaults.withCredentials = true;

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

// Helper to extract CSRF token from response headers or body
export function extractCsrfTokenFromResponse(
  response: AxiosResponse,
): string | null {
  if (!enableCsrfProtection) return null;

  // Check response headers first (primary source from backend)
  const headerToken = response.headers["x-xsrf-token"] as string | undefined;

  if (headerToken) {
    const token = headerToken.trim();
    if (token && token.length > 0) {
      csrfTokenCache = token;
      localStorage.setItem("csrfToken", token);
      return token;
    }
  }

  // Fallback to response body - check CSRF-specific keys first
  // Do NOT use "token" or "accessToken" as they contain the access token, not CSRF token
  const responseData = response.data as Record<string, unknown>;
  const bodyToken = (responseData?.["X-XSRF-TOKEN"] ||
    responseData?.csrfToken ||
    responseData?.csrf ||
    responseData?._csrf) as string | undefined;
  if (bodyToken && typeof bodyToken === "string") {
    csrfTokenCache = bodyToken;
    localStorage.setItem("csrfToken", bodyToken);
    return bodyToken;
  }
  return null;
}

// Function to fetch CSRF token from dedicated endpoint
export async function fetchCsrfToken(): Promise<string | null> {
  if (!enableCsrfProtection) return null;

  try {
    const response = await axios.get("/api/csrf-token");
    const extracted = extractCsrfTokenFromResponse(response);
    return extracted;
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
  async (config) => {
    // CRITICAL: Handle FormData - delete Content-Type header to let axios/browser handle it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Log all requests with auth headers
    const accessToken = localStorage.getItem("accessToken");
    const fallbackToken = localStorage.getItem("token");
    const currentToken = accessToken || fallbackToken;

    // 1. For verify-email endpoint, skip interceptor (use manually set Authorization header)
    if (
      config.url?.includes("/verify-email") ||
      config.url?.includes("verify-email")
    ) {
      return config;
    }

    // 2. For refresh-token endpoint, send refreshToken in Authorization header
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

    // 3. For all other endpoints, send access token in Authorization header
    const token = accessToken || fallbackToken;

    // Skip token validation completely for auth endpoints (login, register, logout)
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/logout") ||
      config.url?.includes("/refresh-token");

    if (isAuthEndpoint) {
      // Skip all token logic for auth endpoints
      // For logout, ALWAYS attach token (even if expired) for backend user identification
      if (config.url?.includes("/auth/logout") && token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.Authorization = `Bearer ${token}`;
        const tokenExpired = isTokenExpired(token);
      }
      return config;
    }

    // Validate token format and expiration for all other requests
    const tokenFormatValid = isValidTokenFormat(token);
    const tokenExpired = token ? isTokenExpired(token) : true;
    const timeRemaining = token ? getTokenTimeRemaining(token) : 0;

    // If token is expired, trigger refresh before sending the request
    if (token && tokenFormatValid && tokenExpired) {
      // Don't attach the expired token - let it fail with 401 to trigger refresh
      // This prevents sending expired tokens to the backend
    } else if (token && tokenFormatValid && !tokenExpired) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Handle CSRF token for POST, PUT, DELETE, PATCH requests
    // Skip CSRF for auth endpoints (login, register, logout) and verify-email
    if (enableCsrfProtection) {
      const needsCsrf =
        config.method &&
        ["post", "put", "delete", "patch"].includes(
          config.method.toLowerCase(),
        ) &&
        !config.url?.includes("/auth/login") &&
        !config.url?.includes("/auth/register") &&
        !config.url?.includes("/auth/logout") &&
        !config.url?.includes("/verify-email") &&
        !config.url?.includes("/csrf-token");

      if (needsCsrf) {
        let csrfToken = getCsrfToken();

        // If CSRF token is missing, try to fetch it
        if (!csrfToken) {
          try {
            csrfToken = await fetchCsrfToken();
          } catch (error) {
            console.error("Error fetching CSRF token:", error);
          }
        }

        if (csrfToken) {
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers["X-XSRF-TOKEN"] = csrfToken;
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
        const extracted = extractCsrfTokenFromResponse(response);
        if (response.config.url?.includes("/login")) {
          console.log(
            "Login response - CSRF extraction result:",
            extracted ? "SUCCESS" : "FAILED",
          );
        }
      } catch (csrfError) {
        console.error("Error extracting CSRF token:", csrfError);
      }
    }
    return response;
  },
  async (error) => {
    // Log all errors
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle logout errors gracefully - don't retry, just resolve
    if (originalRequest.url?.includes("/auth/logout")) {
      // Return a resolved promise so logout cleanup can continue
      return Promise.resolve({
        data: { success: false },
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Error",
        headers: {},
        config: originalRequest,
      });
    }

    // Handle network errors with exponential backoff retry
    if (
      (error.code === "ERR_NETWORK" || !error.response) &&
      !originalRequest._retryCount
    ) {
      originalRequest._retryCount = 0;
      originalRequest._retryAttempts = 3; // Max 3 attempts
      originalRequest._retryDelay = 500; // Start with 500ms
    }

    // Retry logic for network errors
    if (
      originalRequest._retryCount !== undefined &&
      originalRequest._retryCount < originalRequest._retryAttempts
    ) {
      const retryCount = originalRequest._retryCount;
      const delay = originalRequest._retryDelay * Math.pow(2, retryCount); // Exponential backoff

      originalRequest._retryCount += 1;

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request
      return axios(originalRequest);
    }

    // Handle 403 Forbidden - log CSRF token status for debugging
    if (error.response?.status === 403 && enableCsrfProtection) {
      const sentCsrfToken = originalRequest.headers?.["X-XSRF-TOKEN"];
      console.error("❌ 403 Forbidden - CSRF validation failed:", {
        sentCsrfToken: sentCsrfToken
          ? sentCsrfToken.substring(0, 20) + "..."
          : "NOT SENT",
        hasTokenInMemory: !!csrfTokenCache,
        hasTokenInStorage: !!localStorage.getItem("csrfToken"),
        requestUrl: originalRequest.url,
        requestMethod: originalRequest.method?.toUpperCase(),
        responseStatus: error.response?.status,
        responseData: error.response?.data,
      });
      // Don't retry to avoid CORS issues with csrf-token endpoint
    }

    // Check if error is 401 and we haven't retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/logout") &&
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
          throw new Error("No refresh token available");
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_URL}/refresh-token`, {});

        const responseData = response?.data;

        if (!responseData) {
          throw new Error("Invalid refresh token response");
        }

        // Handle response structure - backend returns object directly, not wrapped
        const token = responseData?.token || responseData?.accessToken;
        const newRefreshToken = responseData?.refreshToken;

        if (!token) {
          throw new Error("No token in refresh response");
        }

        // Store with both keys for compatibility
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Update header and retry request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed - call logout endpoint to invalidate session on backend
        try {
          await axios.post(`${API_URL}/logout`);
        } catch (logoutError) {
          // Continue even if logout fails - we still need to clear the session
        }

        // Clear ALL tokens from localStorage and URL parameters
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("csrfToken");
        localStorage.removeItem("user");

        // Remove any URL parameter tokens from verify-email flow
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("token")) {
          urlParams.delete("token");
          const newUrl =
            window.location.pathname +
            (urlParams.toString() ? "?" + urlParams.toString() : "");
          window.history.replaceState({}, "", newUrl);
        }

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
  },
);

export default axios;
