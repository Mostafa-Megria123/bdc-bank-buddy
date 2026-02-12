import axios from "@/lib/axios";
import { endpoints } from "@/config";
import type {
  PaymentCompletionDTO,
  ReservationDTO,
  ReservationsResponse,
  PendingActionResponse,
} from "@/types/reservation";

export type {
  PaymentCompletionDTO,
  ReservationDTO,
  ReservationsResponse,
  PendingActionResponse,
};

// Generic wrapper type for all API responses
interface CustomApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code?: string;
    message?: string;
  };
}

const API_URL = endpoints.reservations;

export const reservationService = {
  getReservationsByUser: async (
    userId: number,
    page: number = 0,
    size: number = 10,
  ): Promise<ReservationsResponse> => {
    try {
      const { data: apiResponse } = await axios.get<
        CustomApiResponse<ReservationsResponse>
      >(`${API_URL}/user/${userId}`, {
        params: {
          page,
          size,
        },
      });
      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  },

  requestRefund: async (reservationId: number): Promise<ReservationDTO> => {
    try {
      const response = await axios.post(
        `${API_URL}/${reservationId}/request-refund`,
      );
      // If response is wrapped in CustomApiResponse, extract the data
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error requesting refund:", error);
      throw error;
    }
  },

  addPaymentCompletion: async (
    reservationId: number,
    paymentCompletion: PaymentCompletionDTO,
    file?: File,
  ): Promise<PendingActionResponse> => {
    try {
      const formData = new FormData();

      // Wrap JSON data in a Blob with proper type declaration
      formData.append(
        "paymentCompletion",
        new Blob([JSON.stringify(paymentCompletion)], {
          type: "application/json",
        }),
      );

      // Append file if provided
      if (file) {
        formData.append("file", file);
      }

      const { data: apiResponse } = await axios.post<
        CustomApiResponse<PendingActionResponse>
      >(`${API_URL}/${reservationId}/payment-completion`, formData);
      console.log("Payment Completion Response:", apiResponse);
      return apiResponse.data;
    } catch (error) {
      console.error("Error adding payment completion:", error);
      throw error;
    }
  },

  editPaymentCompletion: async (
    reservationId: number,
    paymentCompletion: PaymentCompletionDTO,
    file?: File,
  ): Promise<PaymentCompletionDTO> => {
    try {
      const formData = new FormData();

      // Wrap JSON data in a Blob with proper type declaration
      formData.append(
        "paymentCompletion",
        new Blob([JSON.stringify(paymentCompletion)], {
          type: "application/json",
        }),
      );

      // Append file if provided
      if (file) {
        formData.append("file", file);
      }

      const { data: apiResponse } = await axios.put<
        CustomApiResponse<PaymentCompletionDTO>
      >(`${API_URL}/${reservationId}/edit-payment-completion`, formData);
      console.log("Edit Payment Response:", apiResponse);
      return apiResponse.data;
    } catch (error) {
      console.error("Error editing payment completion:", error);
      throw error;
    }
  },
};
