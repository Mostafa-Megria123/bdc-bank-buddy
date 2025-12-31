export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  environment: import.meta.env.MODE, // 'development', 'production', or 'staging'
  isDevelopment: import.meta.env.MODE === "development",
  isProduction: import.meta.env.MODE === "production",
  isStaging: import.meta.env.MODE === "staging",
} as const;

// API endpoints
export const endpoints = {
  faqs: `${config.apiBaseUrl}/faqs`,
  terms: `${config.apiBaseUrl}/termsAndConditions`,
  about: `${config.apiBaseUrl}/about`,
  features: `${config.apiBaseUrl}/features`,
  visionAndMission: `${config.apiBaseUrl}/vision-mission`,
  values: `${config.apiBaseUrl}/our-values`,
  contactInfo: `${config.apiBaseUrl}/contact-info`,
  announcements: `${config.apiBaseUrl}/announcements`,
  files: `${config.apiBaseUrl}/files`,
  projects: `${config.apiBaseUrl}/projects`,
  projectStatuses: `${config.apiBaseUrl}/project-status`,
  unitStatuses: `${config.apiBaseUrl}/unit-statuses`,
  // Add other endpoints here as needed
} as const;
