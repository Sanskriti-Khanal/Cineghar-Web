import axios from "./axios";
import { API } from "./endpoints";

export interface LoyaltyTransaction {
  _id: string;
  change: number;
  reason: string;
  booking?: string;
  createdAt: string;
}

export interface LoyaltyMeResponse {
  success: boolean;
  data?: {
    loyaltyPoints: number;
    recentTransactions: LoyaltyTransaction[];
  };
  message?: string;
}

export const getMyLoyaltyApi = async () => {
  const { data } = await axios.get<LoyaltyMeResponse>(API.LOYALTY.ME);
  return data;
};

