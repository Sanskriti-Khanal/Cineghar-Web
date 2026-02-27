import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type OfferType = "percentage_discount" | "fixed_discount" | "bonus_points";

export interface Offer {
  _id: string;
  name: string;
  code: string;
  description?: string;
  type: OfferType;
  discountPercent?: number;
  discountAmount?: number;
  bonusPoints?: number;
  minSpend?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  maxRedemptions?: number;
  perUserLimit?: number;
}

export interface OfferListResponse {
  data: Offer[];
  page?: number;
  limit?: number;
  totalPages?: number;
  totalOffers?: number;
}

export const getOffersApi = async (params?: { page?: number; limit?: number }) => {
  const { data } = await axios.get<OfferListResponse>(API.ADMIN.OFFERS, {
    params: params ?? {},
  });
  return data;
};

export const getOfferByIdApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<Offer>>(API.ADMIN.OFFER_BY_ID(id));
  return data;
};

export const createOfferApi = async (payload: {
  name: string;
  code: string;
  description?: string;
  type: OfferType;
  discountPercent?: number;
  discountAmount?: number;
  bonusPoints?: number;
  minSpend?: number;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
  maxRedemptions?: number;
  perUserLimit?: number;
}) => {
  const { data } = await axios.post<ApiResponse<Offer>>(API.ADMIN.OFFERS, payload);
  return data;
};

export const updateOfferApi = async (
  id: string,
  payload: Partial<{
    name: string;
    code: string;
    description?: string;
    type: OfferType;
    discountPercent?: number;
    discountAmount?: number;
    bonusPoints?: number;
    minSpend?: number;
    startDate: string;
    endDate?: string;
    isActive?: boolean;
    maxRedemptions?: number;
    perUserLimit?: number;
  }>
) => {
  const { data } = await axios.put<ApiResponse<Offer>>(
    API.ADMIN.OFFER_BY_ID(id),
    payload
  );
  return data;
};

export const deleteOfferApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.OFFER_BY_ID(id)
  );
  return data;
};

