// Reservation Status Enum
export enum ReservationStatus {
  CONFIRMED_RESERVATION = "CONFIRMED_RESERVATION",
  APPROVED_BY_BDC = "APPROVED_BY_BDC",
  REJECTED_BY_BDC = "REJECTED_BY_BDC",
  SOLD = "SOLD",
  SUCCESSFULLY_PAID_DOWN_PAYMENT = "SUCCESSFULLY_PAID_DOWN_PAYMENT",
}

// New Reservation Create Request DTO
export interface ReservationCreateRequest {
  unitId: string;
  projectId: string;
  userNationalId: string;
  captcha: string;
  notes?: string;
}

// Generic API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    title: string;
    message: string;
  };
}

// Updated Reservation DTO
export interface ReservationDTO {
  id: number;
  projectId: number;
  projectName?: string;
  projectNameEn?: string;
  projectNameAr?: string;
  unitId: number;
  unitCode?: string;
  unitNumber?: string;
  customerId: number;
  customerName?: string;
  username: string;
  status: ReservationStatus | string;
  deposit: number;
  orderId: string | null;
  unitPrice?: number;
  meterPrice?: number;
  totalAdvancePayment?: number;
  downPayment?: number;
  reservationDate: string;
  notes?: string;
  createdBy?: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate: string;
  paymentCompletion?: PaymentCompletionDTO;
}

export interface PaymentCompletionDTO {
  depositAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
  serialNumber?: string;
  attachmentUrl?: string;
  dateLastMaintenance?: string;
}

export interface ReservationsResponse {
  content: ReservationDTO[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: string;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PendingActionResponse {
  id?: number;
  reservationId?: number;
  message?: string;
  status?: string;
}
