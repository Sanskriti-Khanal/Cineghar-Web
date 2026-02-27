"use client";

import { useEffect, useState } from "react";
import {
  getOffersApi,
  createOfferApi,
  updateOfferApi,
  deleteOfferApi,
  type Offer,
  type OfferType,
} from "@/lib/api/adminOffers";

const OFFER_TYPES: { value: OfferType; label: string }[] = [
  { value: "percentage_discount", label: "Percentage discount" },
  { value: "fixed_discount", label: "Fixed discount" },
  { value: "bonus_points", label: "Bonus points" },
];

type OfferFormState = Omit<Offer, "_id" | "startDate" | "endDate"> & {
  startDate: string;
  endDate?: string;
};

const emptyForm: OfferFormState = {
  name: "",
  code: "",
  description: "",
  type: "percentage_discount",
  discountPercent: undefined,
  discountAmount: undefined,
  bonusPoints: undefined,
  minSpend: undefined,
  startDate: "",
  endDate: "",
  isActive: true,
  maxRedemptions: undefined,
  perUserLimit: undefined,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OfferFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOffersApi();
      setOffers(res.data ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOffers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (offer: Offer) => {
    setEditingId(offer._id);
    setForm({
      name: offer.name,
      code: offer.code,
      description: offer.description ?? "",
      type: offer.type,
      discountPercent: offer.discountPercent,
      discountAmount: offer.discountAmount,
      bonusPoints: offer.bonusPoints,
      minSpend: offer.minSpend,
      startDate: offer.startDate.slice(0, 10),
      endDate: offer.endDate ? offer.endDate.slice(0, 10) : "",
      isActive: offer.isActive,
      maxRedemptions: offer.maxRedemptions,
      perUserLimit: offer.perUserLimit,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      if (!form.name || !form.code || !form.startDate) {
        setError("Name, code and start date are required.");
        return;
      }

      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      };

      if (editingId) {
        await updateOfferApi(editingId, payload);
      } else {
        await createOfferApi(payload);
      }
      await loadOffers();
      resetForm();
    } catch (e: any) {
      setError(e.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this offer? This cannot be undone.")) return;
    try {
      setDeleteLoadingId(id);
      setError(null);
      await deleteOfferApi(id);
      await loadOffers();
      if (editingId === id) {
        resetForm();
      }
    } catch (e: any) {
      setError(e.message || "Failed to delete offer");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
      <div>
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Offers & Promotions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage featured offers and current promotions across tickets, snacks, and
            loyalty rewards.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {offers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No offers configured yet.
                  </td>
                </tr>
              ) : (
                offers.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-900">{o.name}</div>
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-0.5">
                        Code: {o.code}
                      </div>
                      {o.description && (
                        <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {o.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                          {o.type === "percentage_discount"
                            ? "Percentage"
                            : o.type === "fixed_discount"
                            ? "Fixed"
                            : "Bonus points"}
                        </span>
                        {o.type === "percentage_discount" && o.discountPercent != null && (
                          <span className="text-[11px] text-gray-500">
                            {o.discountPercent}% off
                          </span>
                        )}
                        {o.type === "fixed_discount" && o.discountAmount != null && (
                          <span className="text-[11px] text-gray-500">
                            NPR {o.discountAmount.toLocaleString()} off
                          </span>
                        )}
                        {o.type === "bonus_points" && o.bonusPoints != null && (
                          <span className="text-[11px] text-gray-500">
                            +{o.bonusPoints.toLocaleString()} points
                          </span>
                        )}
                        {o.minSpend != null && (
                          <span className="text-[11px] text-gray-400">
                            Min spend: NPR {o.minSpend.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[11px]">
                          {o.isActive ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                              Inactive
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="flex flex-col gap-1">
                        <span>
                          {formatDate(o.startDate)} – {formatDate(o.endDate)}
                        </span>
                        {o.maxRedemptions != null && (
                          <span className="text-[11px] text-gray-500">
                            Max redemptions: {o.maxRedemptions.toLocaleString()}
                          </span>
                        )}
                        {o.perUserLimit != null && (
                          <span className="text-[11px] text-gray-500">
                            Per user: {o.perUserLimit}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => handleEdit(o)}
                        className="mr-2 text-[#8B0000] font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(o._id)}
                        disabled={deleteLoadingId === o._id}
                        className="text-red-600 font-semibold hover:text-red-800 hover:underline disabled:opacity-50"
                      >
                        {deleteLoadingId === o._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit offer" : "Create offer"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Configure title, code, discount or bonus, validity and limits.
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-medium text-gray-500 hover:text-gray-800"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Offer name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                placeholder="Mid‑Week Ticket Madness"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                placeholder="MIDWEEK30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                placeholder="Save up to 30% on Wednesday evening shows for all CineGhar members."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Type<span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value as OfferType }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                >
                  {OFFER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Min spend (optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.minSpend ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      minSpend: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Dynamic discount inputs */}
            {form.type === "percentage_discount" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Discount percent
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercent ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      discountPercent: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="30"
                />
              </div>
            )}
            {form.type === "fixed_discount" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Discount amount (NPR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.discountAmount ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      discountAmount: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="150"
                />
              </div>
            )}
            {form.type === "bonus_points" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Bonus points
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.bonusPoints ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      bonusPoints: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Start date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  End date (optional)
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Max redemptions (optional)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.maxRedemptions ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      maxRedemptions: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Per-user limit (optional)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.perUserLimit ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      perUserLimit: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]"
                />
                Active
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-md bg-[#8B0000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#a00000] disabled:opacity-60"
              >
                {saving
                  ? editingId
                    ? "Saving..."
                    : "Creating..."
                  : editingId
                  ? "Save changes"
                  : "Create offer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

