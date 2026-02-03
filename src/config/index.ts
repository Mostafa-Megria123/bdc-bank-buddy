const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!RAW_API_BASE_URL) {
  console.error(
    "CRITICAL: VITE_API_BASE_URL not set. Using fallback: https://127.0.0.1:8030/api",
  );
}

export const config = {
  apiBaseUrl: RAW_API_BASE_URL || "https://127.0.0.1:8030/api",
  environment: import.meta.env.MODE, // 'development', 'production', or 'staging'
  isDevelopment: import.meta.env.MODE === "development",
  isProduction: import.meta.env.MODE === "production",
  isStaging: import.meta.env.MODE === "staging",
} as const;

// API endpoints
export const endpoints = {
  faqs: `${config.apiBaseUrl}/faqs`,
  terms: `${config.apiBaseUrl}/terms-conditions`,
  about: `${config.apiBaseUrl}/about`,
  features: `${config.apiBaseUrl}/features`,
  visionAndMission: `${config.apiBaseUrl}/vision-mission`,
  values: `${config.apiBaseUrl}/our-values`,
  contactInfo: `${config.apiBaseUrl}/contact-info`,
  announcements: `${config.apiBaseUrl}/announcements`,
  files: `${config.apiBaseUrl}/files`,
  batchFiles: `${config.apiBaseUrl}/files/batch`,
  projects: `${config.apiBaseUrl}/projects`,
  projectStatuses: `${config.apiBaseUrl}/project-status`,
  unitStatuses: `${config.apiBaseUrl}/unit-statuses`,
  privacyPolicy: `${config.apiBaseUrl}/privacy-policy`,
  auth: `${config.apiBaseUrl}/auth`,
  register: `${config.apiBaseUrl}/customers/register`,
  login: `${config.apiBaseUrl}/auth/login`,
  logout: `${config.apiBaseUrl}/auth/logout`,
  verifyEmail: `${config.apiBaseUrl}/auth/verify-email`,
  verifyNow: `${config.apiBaseUrl}/auth/verify-now`,
  refreshToken: `${config.apiBaseUrl}/auth/refresh-token`,
  forgoetPassword: `${config.apiBaseUrl}/auth/forgot-password`,
  resetPassword: `${config.apiBaseUrl}/auth/reset-password`,
  csrf: `${config.apiBaseUrl}/csrf-token`,
  me: `${config.apiBaseUrl}/auth/me`,
  // Add other endpoints here as needed
} as const;
