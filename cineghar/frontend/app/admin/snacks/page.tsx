"use client";

import { useEffect, useState } from "react";
import {
  getSnackItemsApi,
  createSnackItemApi,
  updateSnackItemApi,
  deleteSnackItemApi,
  getSnackCombosApi,
  createSnackComboApi,
  updateSnackComboApi,
  deleteSnackComboApi,
  type SnackItem,
  type SnackCombo,
  type SnackCategory,
} from "@/lib/api/adminSnacks";

type Tab = "items" | "combos";

const categoryOptions: { value: SnackCategory; label: string }[] = [
  { value: "veg", label: "Veg" },
  { value: "nonveg", label: "Non-Veg" },
  { value: "beverage", label: "Beverage" },
];

const emptyItemForm: Omit<SnackItem, "_id" | "isActive"> & { isActive?: boolean } = {
  name: "",
  description: "",
  price: 0,
  category: "veg",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

const emptyComboForm: Omit<SnackCombo, "_id" | "isActive"> & { isActive?: boolean } = {
  name: "",
  itemsPreview: "",
  price: 0,
  originalPrice: undefined,
  discountLabel: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminSnacksPage() {
  const [tab, setTab] = useState<Tab>("items");

  const [items, setItems] = useState<SnackItem[]>([]);
  const [combos, setCombos] = useState<SnackCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<
    Omit<SnackItem, "_id" | "isActive"> & { isActive?: boolean }
  >(emptyItemForm);
  const [editingComboId, setEditingComboId] = useState<string | null>(null);
  const [comboForm, setComboForm] = useState<
    Omit<SnackCombo, "_id" | "isActive"> & { isActive?: boolean }
  >(emptyComboForm);

  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [comboImageFile, setComboImageFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [itemsRes, combosRes] = await Promise.all([
        getSnackItemsApi(),
        getSnackCombosApi(),
      ]);
      setItems(itemsRes.data ?? []);
      setCombos(combosRes.data ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load snacks");
      setItems([]);
      setCombos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const resetItemForm = () => {
    setEditingItemId(null);
    setItemForm(emptyItemForm);
    setItemImageFile(null);
  };

  const resetComboForm = () => {
    setEditingComboId(null);
    setComboForm(emptyComboForm);
    setComboImageFile(null);
  };

  const handleEditItem = (item: SnackItem) => {
    setTab("items");
    setEditingItemId(item._id);
    setItemForm({
      name: item.name,
      description: item.description ?? "",
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl ?? "",
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setItemImageFile(null);
  };

  const handleEditCombo = (combo: SnackCombo) => {
    setTab("combos");
    setEditingComboId(combo._id);
    setComboForm({
      name: combo.name,
      itemsPreview: combo.itemsPreview,
      price: combo.price,
      originalPrice: combo.originalPrice,
      discountLabel: combo.discountLabel ?? "",
      imageUrl: combo.imageUrl ?? "",
      sortOrder: combo.sortOrder,
      isActive: combo.isActive,
    });
    setComboImageFile(null);
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (!itemForm.name || itemForm.price <= 0) {
        setError("Name and price are required for a snack item.");
        return;
      }
      if (editingItemId) {
        await updateSnackItemApi(editingItemId, {
          ...itemForm,
          imageFile: itemImageFile ?? undefined,
          imageUrl: itemForm.imageUrl || undefined,
        });
      } else {
        await createSnackItemApi({
          ...itemForm,
          imageFile: itemImageFile ?? undefined,
          imageUrl: itemForm.imageUrl || undefined,
        });
      }
      await loadAll();
      resetItemForm();
    } catch (e: any) {
      setError(e.message || "Failed to save snack item");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (!comboForm.name || !comboForm.itemsPreview || comboForm.price <= 0) {
        setError("Name, items preview and price are required for a combo.");
        return;
      }
      if (editingComboId) {
        await updateSnackComboApi(editingComboId, {
          ...comboForm,
          imageFile: comboImageFile ?? undefined,
          imageUrl: comboForm.imageUrl || undefined,
        });
      } else {
        await createSnackComboApi({
          ...comboForm,
          imageFile: comboImageFile ?? undefined,
          imageUrl: comboForm.imageUrl || undefined,
        });
      }
      await loadAll();
      resetComboForm();
    } catch (e: any) {
      setError(e.message || "Failed to save snack combo");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Delete this snack item? This cannot be undone.")) return;
    try {
      setDeleteLoadingId(id);
      setError(null);
      await deleteSnackItemApi(id);
      await loadAll();
      if (editingItemId === id) resetItemForm();
    } catch (e: any) {
      setError(e.message || "Failed to delete snack item");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleDeleteCombo = async (id: string) => {
    if (!window.confirm("Delete this combo? This cannot be undone.")) return;
    try {
      setDeleteLoadingId(id);
      setError(null);
      await deleteSnackComboApi(id);
      await loadAll();
      if (editingComboId === id) resetComboForm();
    } catch (e: any) {
      setError(e.message || "Failed to delete combo");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Snacks & Beverages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage items and combos shown in the Snacks & Beverages step of the booking
            flow.
          </p>
        </div>
        <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("items")}
            className={`rounded-full px-3 py-1.5 font-medium ${
              tab === "items"
                ? "bg-[#8B0000] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Items
          </button>
          <button
            type="button"
            onClick={() => setTab("combos")}
            className={`rounded-full px-3 py-1.5 font-medium ${
              tab === "combos"
                ? "bg-[#8B0000] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Combos
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {tab === "items" && (
        <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
          {/* Items list */}
          <div>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No snack items configured yet.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.description && (
                            <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                          {item.imageUrl && (
                            <div className="mt-0.5 text-[11px] text-gray-400">
                              Image: <span className="break-all">{item.imageUrl}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700">
                          <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                            {item.category === "veg"
                              ? "Veg"
                              : item.category === "nonveg"
                              ? "Non-Veg"
                              : "Beverage"}
                          </div>
                          <div className="mt-1 text-[11px] text-gray-500">
                            {item.isActive ? "Active" : "Inactive"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          NPR {item.price.toLocaleString()}
                          <div className="mt-0.5 text-[11px] text-gray-400">
                            Order: {item.sortOrder}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <button
                            type="button"
                            onClick={() => handleEditItem(item)}
                            className="mr-2 text-[#8B0000] font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteItem(item._id)}
                            disabled={deleteLoadingId === item._id}
                            className="text-red-600 font-semibold hover:text-red-800 hover:underline disabled:opacity-50"
                          >
                            {deleteLoadingId === item._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Item form */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingItemId ? "Edit snack item" : "Create snack item"}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Configure name, category, price and visibility.
                  </p>
                </div>
                {editingItemId && (
                  <button
                    type="button"
                    onClick={resetItemForm}
                    className="text-xs font-medium text-gray-500 hover:text-gray-800"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitItem} className="mt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    placeholder="Large Popcorn"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    placeholder="Fresh buttered popcorn"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Category<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) =>
                        setItemForm((f) => ({
                          ...f,
                          category: e.target.value as SnackCategory,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Price (NPR)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm((f) => ({
                          ...f,
                          price: Number(e.target.value || 0),
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="200"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Image
                    <span className="ml-1 text-[11px] font-normal text-gray-500">
                      (upload file or paste URL)
                    </span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setItemImageFile(file);
                      }}
                      className="block w-full text-xs text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#8B0000] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#a00000]"
                    />
                    <input
                      type="text"
                      value={itemForm.imageUrl}
                      onChange={(e) =>
                        setItemForm((f) => ({ ...f, imageUrl: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="/images/snacks/popcorn.jpg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Sort order
                    </label>
                    <input
                      type="number"
                      value={itemForm.sortOrder}
                      onChange={(e) =>
                        setItemForm((f) => ({
                          ...f,
                          sortOrder: Number(e.target.value || 0),
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={itemForm.isActive}
                        onChange={(e) =>
                          setItemForm((f) => ({ ...f, isActive: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]"
                      />
                      Active
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-md bg-[#8B0000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a00000] disabled:opacity-60"
                  >
                    {saving
                      ? editingItemId
                        ? "Saving..."
                        : "Creating..."
                      : editingItemId
                      ? "Save changes"
                      : "Create item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {tab === "combos" && (
        <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
          {/* Combos list */}
          <div>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Combo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flags
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {combos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No combos configured yet.
                      </td>
                    </tr>
                  ) : (
                    combos.map((combo) => (
                      <tr key={combo._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900">{combo.name}</div>
                          <div className="mt-0.5 text-xs text-gray-500">
                            {combo.itemsPreview}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex flex-col gap-0.5">
                            <span>NPR {combo.price.toLocaleString()}</span>
                            {combo.originalPrice != null && (
                              <span className="text-[11px] text-gray-500 line-through">
                                NPR {combo.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700">
                          <div className="flex flex-wrap gap-1">
                            {combo.discountLabel && (
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-700">
                                {combo.discountLabel}
                              </span>
                            )}
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                              {combo.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-gray-400">
                            Order: {combo.sortOrder}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <button
                            type="button"
                            onClick={() => handleEditCombo(combo)}
                            className="mr-2 text-[#8B0000] font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteCombo(combo._id)}
                            disabled={deleteLoadingId === combo._id}
                            className="text-red-600 font-semibold hover:text-red-800 hover:underline disabled:opacity-50"
                          >
                            {deleteLoadingId === combo._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Combo form */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingComboId ? "Edit combo" : "Create combo"}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Configure combo name, items preview, pricing and discount label.
                  </p>
                </div>
                {editingComboId && (
                  <button
                    type="button"
                    onClick={resetComboForm}
                    className="text-xs font-medium text-gray-500 hover:text-gray-800"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitCombo} className="mt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Combo name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={comboForm.name}
                    onChange={(e) =>
                      setComboForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    placeholder="Popcorn & Drink Combo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Items preview<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={comboForm.itemsPreview}
                    onChange={(e) =>
                      setComboForm((f) => ({ ...f, itemsPreview: e.target.value }))
                    }
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    placeholder="Large popcorn + Pepsi 500ml"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Price (NPR)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={comboForm.price}
                      onChange={(e) =>
                        setComboForm((f) => ({
                          ...f,
                          price: Number(e.target.value || 0),
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="260"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Original price (optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={comboForm.originalPrice ?? ""}
                      onChange={(e) =>
                        setComboForm((f) => ({
                          ...f,
                          originalPrice: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="300"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Discount label (optional)
                  </label>
                  <input
                    type="text"
                    value={comboForm.discountLabel}
                    onChange={(e) =>
                      setComboForm((f) => ({ ...f, discountLabel: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                    placeholder="Save NPR 40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Image
                    <span className="ml-1 text-[11px] font-normal text-gray-500">
                      (upload file or paste URL)
                    </span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setComboImageFile(file);
                      }}
                      className="block w-full text-xs text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#8B0000] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#a00000]"
                    />
                    <input
                      type="text"
                      value={comboForm.imageUrl}
                      onChange={(e) =>
                        setComboForm((f) => ({ ...f, imageUrl: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="/images/snacks/combo1.jpg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Sort order
                    </label>
                    <input
                      type="number"
                      value={comboForm.sortOrder}
                      onChange={(e) =>
                        setComboForm((f) => ({
                          ...f,
                          sortOrder: Number(e.target.value || 0),
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={comboForm.isActive}
                        onChange={(e) =>
                          setComboForm((f) => ({ ...f, isActive: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]"
                      />
                      Active
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-md bg-[#8B0000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a00000] disabled:opacity-60"
                  >
                    {saving
                      ? editingComboId
                        ? "Saving..."
                        : "Creating..."
                      : editingComboId
                      ? "Save changes"
                      : "Create combo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

