import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardStats {
  totalMovies: number;
  todayBookings: number;
  activeShowsToday: number;
  todayRevenue: number;
}

export interface RecentOrderItem {
  _id: string;
  type: "order" | "booking";
  user?: { name?: string; email?: string };
  amount: number;
  seatsCount: number;
  seats: string[];
  movieTitle?: string | null;
  createdAt: string;
  status: string;
}

export const getAdminDashboardStatsApi = async () => {
  const { data } = await axios.get<ApiResponse<DashboardStats>>(
    API.ADMIN.DASHBOARD_STATS
  );
  return data;
};

export const getAdminDashboardOrdersApi = async (params?: { limit?: number }) => {
  const { data } = await axios.get<ApiResponse<RecentOrderItem[]>>(
    API.ADMIN.DASHBOARD_ORDERS,
    { params: params ?? {} }
  );
  return data;
};
