import axios from "./axios";
import { API } from "./endpoints";
import type { AuthUser } from "./auth";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoyaltyUserSummary extends Pick<AuthUser, "_id" | "name" | "email" | "role"> {
  loyaltyPoints?: number;
  createdAt?: string;
}

export interface LoyaltyUserListResponse {
  page?: number;
  limit?: number;
  totalPages?: number;
  totalUsers?: number;
  data: LoyaltyUserSummary[];
}

export interface LoyaltyTransaction {
  _id: string;
  change: number;
  reason: string;
  booking?: string;
  createdAt: string;
}

export interface LoyaltyUserHistory {
  user: {
    _id: string;
    name?: string;
    email?: string;
    loyaltyPoints?: number;
  };
  transactions: LoyaltyTransaction[];
}

export const getLoyaltyUsersApi = async (params?: { page?: number; limit?: number }) => {
  const { data } = await axios.get<LoyaltyUserListResponse>(
    API.ADMIN.LOYALTY_USERS,
    { params: params ?? {} }
  );
  return data;
};

export const getLoyaltyUserHistoryApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<LoyaltyUserHistory>>(
    API.ADMIN.LOYALTY_USER_BY_ID(id)
  );
  return data;
};

export const adjustLoyaltyPointsApi = async (payload: {
  userId: string;
  change: number;
  reason: string;
}) => {
  const { data } = await axios.post<ApiResponse<{ loyaltyPoints: number }>>(
    API.ADMIN.LOYALTY_ADJUST,
    payload
  );
  return data;
};

