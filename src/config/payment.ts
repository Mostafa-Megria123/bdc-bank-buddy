interface PaymentEnvironment {
  baseUrl: string;
  apiUrl: string;
}

interface PaymentRedirectUrls {
  success: string;
  failure: string;
  cancel: string;
}

interface PaymentConfig {
  environment: PaymentEnvironment;
  redirectPaths: PaymentRedirectUrls;
  getFullRedirectUrls(): PaymentRedirectUrls;
  getEnvironmentType(): "development" | "production";
}

const ENVIRONMENTS: Record<string, PaymentEnvironment> = {
  development: {
    baseUrl: "http://localhost:5173/bdc-real-estate",
    apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8030/api",
  },
  production: {
    baseUrl: "https://your-domain.com/bdc-real-estate", // TODO: Replace with actual production domain
    apiUrl:
      import.meta.env.VITE_API_BASE_URL || "https://api.your-domain.com/api",
  },
} as const;

class PaymentConfiguration implements PaymentConfig {
  public readonly environment: PaymentEnvironment;
  public readonly redirectPaths: PaymentRedirectUrls = {
    success: "/payment-verification?status=success",
    failure: "/payment-verification?status=failure",
    cancel: "/payment-verification?status=cancelled",
  };

  constructor() {
    const envType = this.getEnvironmentType();
    this.environment = ENVIRONMENTS[envType];

    if (!this.environment) {
      console.warn(
        `Unknown environment: ${envType}, falling back to development`,
      );
      this.environment = ENVIRONMENTS.development;
    }
  }

  /**
   * Gets the current environment type
   */
  getEnvironmentType(): "development" | "production" {
    return import.meta.env.PROD ? "production" : "development";
  }

  /**
   * Gets full redirect URLs for payment gateway configuration
   */
  getFullRedirectUrls(): PaymentRedirectUrls {
    return {
      success: `${this.environment.baseUrl}${this.redirectPaths.success}`,
      failure: `${this.environment.baseUrl}${this.redirectPaths.failure}`,
      cancel: `${this.environment.baseUrl}${this.redirectPaths.cancel}`,
    };
  }

  /**
   * Gets the base URL for the application
   */
  getBaseUrl(): string {
    return this.environment.baseUrl;
  }

  /**
   * Gets the API base URL
   */
  getApiUrl(): string {
    return this.environment.apiUrl;
  }

  /**
   * Validates the configuration
   */
  validate(): boolean {
    const required = [this.environment.baseUrl, this.environment.apiUrl];

    const isValid = required.every((url) => url && url.trim() !== "");

    if (!isValid) {
      console.error(
        "Payment configuration validation failed. Please check environment variables.",
      );
    }

    return isValid;
  }

  /**
   * Logs current configuration (for debugging)
   */
  debug(): void {
    if (this.getEnvironmentType() === "development") {
      console.group("Payment Configuration");
      console.log("Environment:", this.getEnvironmentType());
      console.log("Base URL:", this.environment.baseUrl);
      console.log("API URL:", this.environment.apiUrl);
      console.log("Redirect URLs:", this.getFullRedirectUrls());
      console.groupEnd();
    }
  }
}

export const PAYMENT_CONFIG = new PaymentConfiguration();

// Validate configuration on import
if (!PAYMENT_CONFIG.validate()) {
  console.error(
    "Payment configuration is invalid. Please check your environment variables.",
  );
}

export type { PaymentEnvironment, PaymentRedirectUrls, PaymentConfig };
