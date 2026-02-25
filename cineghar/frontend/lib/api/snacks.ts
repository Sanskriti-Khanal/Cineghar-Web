import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type SnackCategory = "veg" | "nonveg" | "beverage";

export interface SnackItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: SnackCategory;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SnackCombo {
  _id: string;
  name: string;
  itemsPreview: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export const getSnackItemsApi = async () => {
  const { data } = await axios.get<ApiResponse<SnackItem[]>>(API.SNACKS.ITEMS);
  return data;
};

export const getSnackCombosApi = async () => {
  const { data } = await axios.get<ApiResponse<SnackCombo[]>>(API.SNACKS.COMBOS);
  return data;
};