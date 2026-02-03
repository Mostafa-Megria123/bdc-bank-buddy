const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

// Get API base URL from Vite environment variable
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!RAW_API_BASE_URL) {
  console.error(
    "CRITICAL: VITE_API_BASE_URL not set in fetch-client. Using fallback: https://127.0.0.1:8030/api",
  );
}

const API_BASE_URL = RAW_API_BASE_URL || "https://127.0.0.1:8030/api";

// Remove trailing /api if present
const CLEAN_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

// Track ongoing refresh to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
  // If already refreshing, wait for the ongoing refresh
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        // Dispatch custom event so AuthContext can log user out
        window.dispatchEvent(new Event("token-expired"));
        return false;
      }

      const refreshUrl = `${CLEAN_BASE_URL}/auth/refresh-token`;

      // Try to get CSRF token from cookie first, then from localStorage
      let csrfToken = getCookie("XSRF-TOKEN");
      if (!csrfToken) {
        csrfToken = localStorage.getItem("csrfToken") || "";
      }

      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken && { "X-XSRF-TOKEN": csrfToken }),
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.token || data.accessToken;

        // Also capture CSRF token if returned in refresh response
        const newCsrfToken = response.headers.get("X-XSRF-TOKEN");
        if (newCsrfToken) {
          localStorage.setItem("csrfToken", newCsrfToken);
        }

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          return true;
        }
      } else if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("token-expired"));
        return false;
      }

      return false;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new Event("token-expired"));
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const fullUrl = url.startsWith("http") ? url : `${CLEAN_BASE_URL}${url}`;

  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const headers = new Headers(options.headers || {});

  // Try to get CSRF token from cookie first, then from localStorage
  let csrfToken = getCookie("XSRF-TOKEN");
  if (!csrfToken) {
    csrfToken = localStorage.getItem("csrfToken") || "";
  }

  // 1. Add JWT Authorization
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 2. Add CSRF Token for all requests
  if (csrfToken) {
    headers.set("X-XSRF-TOKEN", csrfToken);
  }
  // 3. Set Content Type (skip for FormData to let browser set boundary)
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Required for CSRF cookies
  };

  const response = await fetch(fullUrl, config);

  // 4. Handle Unauthorized - Try to refresh token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Retry the original request with new token
      const newToken = localStorage.getItem("accessToken");
      const newHeaders = new Headers(config.headers || {});

      // Try to get CSRF token from cookie first, then from localStorage
      let newCsrfToken = getCookie("XSRF-TOKEN");
      if (!newCsrfToken) {
        newCsrfToken = localStorage.getItem("csrfToken") || "";
      }

      if (newToken) {
        newHeaders.set("Authorization", `Bearer ${newToken}`);
      }

      if (newCsrfToken) {
        newHeaders.set("X-XSRF-TOKEN", newCsrfToken);
      }

      if (
        !newHeaders.has("Content-Type") &&
        !(config.body instanceof FormData)
      ) {
        newHeaders.set("Content-Type", "application/json");
      }

      const retryConfig: RequestInit = {
        ...config,
        headers: newHeaders,
        credentials: "include",
      };

      const retryResponse = await fetch(fullUrl, retryConfig);

      if (retryResponse.ok || retryResponse.status === 204) {
        if (retryResponse.status === 204) return null;

        const contentType = retryResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const jsonResponse = await retryResponse.json();
          return jsonResponse;
        }

        return retryResponse.text().then((text) => {
          try {
            return JSON.parse(text);
          } catch {
            return text;
          }
        });
      }

      if (!retryResponse.ok) {
        const error = await retryResponse
          .json()
          .catch(() => ({ message: "An error occurred" }));
        throw error;
      }
    } else {
      // Refresh failed, user must login again
      const errorData = await response
        .json()
        .catch(() => ({ error: { message: "Session expired" } }));
      const errorMessage =
        errorData.error?.message || errorData.message || "Session expired";
      const error: Error & { statusCode?: number } = new Error(errorMessage);
      error.statusCode = 401;
      throw error;
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  // Check if response is JSON
  if (contentType && contentType.includes("application/json")) {
    const jsonResponse = await response.json();
    return jsonResponse;
  }

  // Handle plain text responses
  return response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch {
      // If it's not valid JSON, return the text as-is
      return text;
    }
  });
};
