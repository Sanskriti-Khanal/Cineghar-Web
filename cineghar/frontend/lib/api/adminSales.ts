import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type SalesGroupBy = "movie" | "day" | undefined;

export interface SalesSummaryOverall {
  from: string;
  to: string;
  totalRevenue: number;
  totalTickets: number;
  totalBookings: number;
}

export interface SalesSummaryByMovieItem {
  movieId: string;
  movieTitle: string;
  totalRevenue: number;
  totalTickets: number;
  totalBookings: number;
}

export interface SalesSummaryByMovie {
  from: string;
  to: string;
  items: SalesSummaryByMovieItem[];
}

export interface SalesSummaryByDayItem {
  date: string;
  totalRevenue: number;
  totalTickets: number;
  totalBookings: number;
}

export interface SalesSummaryByDay {
  from: string;
  to: string;
  items: SalesSummaryByDayItem[];
}

export interface SalesSummaryParams {
  from?: string;
  to?: string;
  groupBy?: SalesGroupBy;
}

export const getSalesSummaryOverallApi = async (
  params: Omit<SalesSummaryParams, "groupBy">
) => {
  const { data } = await axios.get<ApiResponse<SalesSummaryOverall>>(
    API.ADMIN.SALES_SUMMARY,
    { params }
  );
  return data;
};

export const getSalesSummaryByMovieApi = async (
  params: Omit<SalesSummaryParams, "groupBy">
) => {
  const { data } = await axios.get<ApiResponse<SalesSummaryByMovie>>(
    API.ADMIN.SALES_SUMMARY,
    { params: { ...params, groupBy: "movie" } }
  );
  return data;
};

export const getSalesSummaryByDayApi = async (
  params: Omit<SalesSummaryParams, "groupBy">
) => {
  const { data } = await axios.get<ApiResponse<SalesSummaryByDay>>(
    API.ADMIN.SALES_SUMMARY,
    { params: { ...params, groupBy: "day" } }
  );
  return data;
};

