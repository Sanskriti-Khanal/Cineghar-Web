import axios from "./axios";
import { API } from "./endpoints";

interface InitiateKhaltiPayload {
  amount: number; // in NPR (rupees) – subtotal before discount
  purchaseOrderId: string;
  purchaseOrderName: string;
  metadata?: Record<string, unknown>;
  offerCode?: string;
  loyaltyPointsToRedeem?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status:
    | "Completed"
    | "Pending"
    | "Refunded"
    | "Expired"
    | "User canceled"
    | "Partially refunded"
    | string;
  transaction_id: string | null;
  fee: number;
  refunded: boolean;
}

export const initiateKhaltiPaymentApi = async (
  payload: InitiateKhaltiPayload
) => {
  const { data } = await axios.post<ApiResponse<KhaltiInitiateResponse>>(
    API.PAYMENT.KHALTI_INITIATE,
    payload
  );
  return data;
};

export const lookupKhaltiPaymentApi = async (pidx: string) => {
  const { data } = await axios.post<ApiResponse<KhaltiLookupResponse>>(
    API.PAYMENT.KHALTI_LOOKUP,
    { pidx }
  );
  return data;
};

export const confirmPaymentApi = async (payload: {
  pidx: string;
  purchaseOrderId: string;
}) => {
  const { data } = await axios.post<ApiResponse<{ _id: string }>>(
    API.PAYMENT.CONFIRM,
    payload
  );
  return data;
};

