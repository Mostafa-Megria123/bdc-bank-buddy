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

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const fullUrl = url.startsWith("http") ? url : `${CLEAN_BASE_URL}${url}`;

  console.debug("fetchClient making request to:", {
    fullUrl,
    originalUrl: url,
  });

  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});

  // 1. Add JWT Authorization
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 2. Add CSRF Token for Mutating Requests
  if (["POST", "PUT", "DELETE", "PATCH"].includes(options.method || "GET")) {
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      headers.set("X-XSRF-TOKEN", csrfToken);
    }
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

  // 4. Handle Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw new Error("Unauthorized");
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

  return response.json();
};
