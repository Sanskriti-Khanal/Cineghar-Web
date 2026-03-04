import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ActiveOffer {
  _id: string;
  name: string;
  code: string;
  description?: string;
  type: "percentage_discount" | "fixed_discount";
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
}

export const getActiveOffersApi = async () => {
  const { data } = await axios.get<ApiResponse<ActiveOffer[]>>(API.OFFERS);
  return data;
};
