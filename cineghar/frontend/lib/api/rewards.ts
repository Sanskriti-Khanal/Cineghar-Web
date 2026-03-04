import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Reward {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  pointsRequired: number;
  isPopular?: boolean;
  sortOrder?: number;
}

export const getRewardsApi = async () => {
  const { data } = await axios.get<ApiResponse<Reward[]>>(API.REWARDS);
  return data;
};
