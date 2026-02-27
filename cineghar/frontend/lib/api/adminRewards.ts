import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Reward {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  pointsRequired: number;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export const getRewardsApi = async () => {
  const { data } = await axios.get<ApiResponse<Reward[]>>(API.ADMIN.REWARDS);
  return data;
};

export const getRewardByIdApi = async (id: string) => {
  const { data } = await axios.get<ApiResponse<Reward>>(API.ADMIN.REWARD_BY_ID(id));
  return data;
};

export const createRewardApi = async (payload: {
  title: string;
  subtitle?: string;
  description?: string;
  pointsRequired: number;
  isPopular?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}) => {
  const { data } = await axios.post<ApiResponse<Reward>>(API.ADMIN.REWARDS, payload);
  return data;
};

export const updateRewardApi = async (
  id: string,
  payload: Partial<{
    title: string;
    subtitle?: string;
    description?: string;
    pointsRequired: number;
    isPopular?: boolean;
    isActive?: boolean;
    sortOrder?: number;
  }>
) => {
  const { data } = await axios.put<ApiResponse<Reward>>(
    API.ADMIN.REWARD_BY_ID(id),
    payload
  );
  return data;
};

export const deleteRewardApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.REWARD_BY_ID(id)
  );
  return data;
};

