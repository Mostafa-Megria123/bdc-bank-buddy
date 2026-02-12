export interface PaymentCompletionDTO {
  depositAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
  serialNumber?: string;
  attachmentUrl?: string;
  dateLastMaintenance?: string;
}

export interface ReservationDTO {
  id: number;
  projectId: number;
  projectNameEn: string;
  projectNameAr: string;
  unitId: number;
  unitNumber: string;
  orderId: string;
  status: string;
  deposit: number;
  unitPrice: number;
  paymentCompletion?: PaymentCompletionDTO;
  createdDate: string;
  lastModifiedDate: string;
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
