import axios from "./axios";
import { API } from "./endpoints";

interface ApiResponse<T> {
  success: boolean;
  message: string;
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
  const { data } = await axios.get<ApiResponse<SnackItem[]>>(
    API.ADMIN.SNACK_ITEMS
  );
  return data;
};

export const createSnackItemApi = async (
  payload: Omit<SnackItem, "_id" | "isActive" | "imageUrl"> & {
    isActive?: boolean;
    imageFile?: File;
    imageUrl?: string;
  }
) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("category", payload.category);
  if (payload.sortOrder !== undefined) {
    formData.append("sortOrder", String(payload.sortOrder));
  }
  if (payload.isActive !== undefined) {
    formData.append("isActive", String(payload.isActive));
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  } else if (payload.imageUrl) {
    formData.append("imageUrl", payload.imageUrl);
  }

  const { data } = await axios.post<ApiResponse<SnackItem>>(
    API.ADMIN.SNACK_ITEMS,
    formData
  );
  return data;
};

export const updateSnackItemApi = async (
  id: string,
  payload: Partial<Omit<SnackItem, "_id" | "imageUrl">> & {
    imageFile?: File;
    imageUrl?: string;
  }
) => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.price !== undefined) {
    formData.append("price", String(payload.price));
  }
  if (payload.category) formData.append("category", payload.category);
  if (payload.sortOrder !== undefined) {
    formData.append("sortOrder", String(payload.sortOrder));
  }
  if (payload.isActive !== undefined) {
    formData.append("isActive", String(payload.isActive));
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  } else if (payload.imageUrl) {
    formData.append("imageUrl", payload.imageUrl);
  }

  const { data } = await axios.put<ApiResponse<SnackItem>>(
    API.ADMIN.SNACK_ITEM_BY_ID(id),
    formData
  );
  return data;
};

export const deleteSnackItemApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.SNACK_ITEM_BY_ID(id)
  );
  return data;
};

export const getSnackCombosApi = async () => {
  const { data } = await axios.get<ApiResponse<SnackCombo[]>>(
    API.ADMIN.SNACK_COMBOS
  );
  return data;
};

export const createSnackComboApi = async (
  payload: Omit<SnackCombo, "_id" | "isActive" | "imageUrl"> & {
    isActive?: boolean;
    imageFile?: File;
    imageUrl?: string;
  }
) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("itemsPreview", payload.itemsPreview);
  formData.append("price", String(payload.price));
  if (payload.originalPrice !== undefined) {
    formData.append("originalPrice", String(payload.originalPrice));
  }
  if (payload.discountLabel) {
    formData.append("discountLabel", payload.discountLabel);
  }
  if (payload.sortOrder !== undefined) {
    formData.append("sortOrder", String(payload.sortOrder));
  }
  if (payload.isActive !== undefined) {
    formData.append("isActive", String(payload.isActive));
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  } else if (payload.imageUrl) {
    formData.append("imageUrl", payload.imageUrl);
  }

  const { data } = await axios.post<ApiResponse<SnackCombo>>(
    API.ADMIN.SNACK_COMBOS,
    formData
  );
  return data;
};

export const updateSnackComboApi = async (
  id: string,
  payload: Partial<Omit<SnackCombo, "_id" | "imageUrl">> & {
    imageFile?: File;
    imageUrl?: string;
  }
) => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.itemsPreview) formData.append("itemsPreview", payload.itemsPreview);
  if (payload.price !== undefined) {
    formData.append("price", String(payload.price));
  }
  if (payload.originalPrice !== undefined) {
    formData.append("originalPrice", String(payload.originalPrice));
  }
  if (payload.discountLabel) {
    formData.append("discountLabel", payload.discountLabel);
  }
  if (payload.sortOrder !== undefined) {
    formData.append("sortOrder", String(payload.sortOrder));
  }
  if (payload.isActive !== undefined) {
    formData.append("isActive", String(payload.isActive));
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  } else if (payload.imageUrl) {
    formData.append("imageUrl", payload.imageUrl);
  }

  const { data } = await axios.put<ApiResponse<SnackCombo>>(
    API.ADMIN.SNACK_COMBO_BY_ID(id),
    formData
  );
  return data;
};

export const deleteSnackComboApi = async (id: string) => {
  const { data } = await axios.delete<ApiResponse<unknown>>(
    API.ADMIN.SNACK_COMBO_BY_ID(id)
  );
  return data;
};

