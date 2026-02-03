/**
 * JWT Token Utilities
 * Handles JWT token validation and expiration checking
 */

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decodes a JWT token without verification (client-side only)
 * Returns null if token is invalid
 */
export function decodeJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    // Base64 URL decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * Returns true if expired, false if still valid
 * Includes a 30-second buffer to prevent edge cases
 */
export function isTokenExpired(token: string): boolean {
  if (!token || typeof token !== "string") {
    return true;
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // Get current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Add 30-second buffer to proactively refresh tokens
  const bufferTime = 30;
  const isExpired = payload.exp <= currentTime + bufferTime;

  return isExpired;
}

/**
 * Gets the remaining time until token expiration in seconds
 * Returns 0 if already expired
 */
export function getTokenTimeRemaining(token: string): number {
  if (!token) return 0;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - currentTime;

  return Math.max(0, remaining);
}

/**
 * Validates if a token string is properly formatted
 */
export function isValidTokenFormat(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  if (token === "undefined" || token === "null") return false;
  
  // Check JWT format (3 parts separated by dots)
  const parts = token.split(".");
  return parts.length === 3;
}
