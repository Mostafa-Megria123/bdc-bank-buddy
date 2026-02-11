import axios from "@/lib/axios";
import { endpoints } from "@/config/index";

export interface PaymentRequest {
  unitId: string;
  projectId: string;
  amount: number;
  reservationDate: string;
  notes: string;
  userNationalId: string;
}

export interface CheckoutResponse {
  errorCode: string;
  orderId: string;
  formUrl: string;
}

export interface TransactionStatusRequest {
  orderId: string;
  userNationalId: string;
}

export interface TransactionStatusResponse {
  success: boolean;
  status: "PAID" | "FAILED" | "PENDING" | "CANCELLED";
  message: string;
  bookingId?: string;
  transactionId?: string;
  amount?: number;
  paymentDate?: string;
}

const SUCCESS_CODES = ["0", "SUCCESS"] as const;

export class PaymentError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

export class CheckoutError extends PaymentError {
  constructor(message: string, code?: string, originalError?: unknown) {
    super(message, code, originalError);
    this.name = "CheckoutError";
  }
}

export class TransactionStatusError extends PaymentError {
  constructor(message: string, code?: string, originalError?: unknown) {
    super(message, code, originalError);
    this.name = "TransactionStatusError";
  }
}

const validatePaymentRequest = (data: PaymentRequest): void => {
  const requiredFields: (keyof PaymentRequest)[] = [
    "unitId",
    "projectId",
    "amount",
    "reservationDate",
    "userNationalId",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new PaymentError(`Missing required field: ${field}`);
    }
  }

  if (data.amount <= 0) {
    throw new PaymentError("Payment amount must be greater than zero");
  }

  if (data.userNationalId.length !== 14) {
    throw new PaymentError("Invalid national ID format");
  }
};

/**
 * Validates transaction status request data
 */
const validateStatusRequest = (data: TransactionStatusRequest): void => {
  if (!data.orderId) {
    throw new PaymentError("Order ID is required");
  }
  if (!data.userNationalId) {
    throw new PaymentError("User national ID is required");
  }
};

/**
 * Checks if checkout response indicates success
 */
const isSuccessfulCheckout = (response: CheckoutResponse): boolean => {
  return SUCCESS_CODES.includes(
    response.errorCode as (typeof SUCCESS_CODES)[number],
  );
};

/**
 * Creates session storage data for payment tracking
 */
const createPaymentSession = (
  checkoutResponse: CheckoutResponse,
  paymentRequest: PaymentRequest,
  projectName: string,
): object => {
  return {
    orderId: checkoutResponse.orderId,
    unitId: paymentRequest.unitId,
    projectId: paymentRequest.projectId,
    projectName,
    amount: paymentRequest.amount,
    userNationalId: paymentRequest.userNationalId,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Initiates payment process by calling checkout endpoint
 * @param paymentData - Payment request data
 * @param projectName - Optional project name for session tracking
 * @returns Promise<CheckoutResponse>
 * @throws {CheckoutError} When checkout fails or validation fails
 */
export const checkout = async (
  paymentData: PaymentRequest,
  projectName?: string,
): Promise<CheckoutResponse> => {
  try {
    // Validate input data
    validatePaymentRequest(paymentData);

    // Make API call using endpoint from config
    // CSRF token will be automatically added by axios interceptor
    const { data: response } = await axios.post<CheckoutResponse>(
      endpoints.paymentCheckout,
      paymentData,
    );

    // Validate response
    if (!response.orderId || !response.formUrl) {
      throw new CheckoutError("Invalid checkout response from server");
    }

    // Store session data if project name provided
    if (projectName) {
      const sessionData = createPaymentSession(
        response,
        paymentData,
        projectName,
      );
      sessionStorage.setItem("pendingPayment", JSON.stringify(sessionData));
    }

    return response;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Checkout API error:", error);
    throw new CheckoutError(
      `Failed to initiate payment: ${errorMessage}`,
      undefined,
      error,
    );
  }
};

/**
 * Checks transaction status after payment completion
 * @param statusData - Transaction status request data
 * @returns Promise<TransactionStatusResponse>
 * @throws {TransactionStatusError} When status check fails or validation fails
 */
export const checkTransactionStatus = async (
  statusData: TransactionStatusRequest,
): Promise<TransactionStatusResponse> => {
  try {
    // Validate input data
    validateStatusRequest(statusData);

    // Make API call using endpoint from config
    // CSRF token will be automatically added by axios interceptor
    const { data: response } = await axios.post<TransactionStatusResponse>(
      endpoints.paymentCheckTrxStatus,
      statusData,
    );

    return response;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Transaction status check error:", error);
    throw new TransactionStatusError(
      `Failed to verify payment status: ${errorMessage}`,
      undefined,
      error,
    );
  }
};

/**
 * Utility function to check if checkout response indicates success
 */
export const isCheckoutSuccessful = (response: CheckoutResponse): boolean => {
  return isSuccessfulCheckout(response);
};

/**
 * Clears pending payment from session storage
 */
export const clearPaymentSession = (): void => {
  sessionStorage.removeItem("pendingPayment");
};

/**
 * Gets pending payment data from session storage
 */
export const getPendingPayment = (): object | null => {
  try {
    const data = sessionStorage.getItem("pendingPayment");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse pending payment data:", error);
    return null;
  }
};

/**
 * Payment service object with all payment-related functions
 * Maintains backward compatibility with the previous class-based approach
 */
export const paymentService = {
  checkout,
  checkTransactionStatus,
  isCheckoutSuccessful,
  clearPaymentSession,
  getPendingPayment,
} as const;
