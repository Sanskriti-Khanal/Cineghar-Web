import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface OrderItem {
  _id: string;
  purchaseOrderId: string;
  amount: number;
  seatsCount: number;
  seats: string[];
  movieTitle?: string;
  movieId?: string;
  status: string;
  createdAt: string;
}

export const getMyOrdersApi = async (params?: { limit?: number }) => {
  const { data } = await axios.get<ApiResponse<OrderItem[]>>(API.ORDERS, {
    params: params ?? {},
  });
  return data;
};
