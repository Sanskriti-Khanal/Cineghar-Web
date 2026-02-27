"use client";

import { useEffect, useState } from "react";
import {
  getRewardsApi,
  createRewardApi,
  updateRewardApi,
  deleteRewardApi,
  type Reward,
} from "@/lib/api/adminRewards";

const initialForm: Omit<Reward, "_id"> = {
  title: "",
  subtitle: "",
  description: "",
  pointsRequired: 0,
  isPopular: false,
  isActive: true,
  sortOrder: 0,
};

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Reward, "_id">>(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const loadRewards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRewardsApi();
      setRewards(res.data ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load rewards");
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRewards();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleEdit = (reward: Reward) => {
    setEditingId(reward._id);
    setForm({
      title: reward.title,
      subtitle: reward.subtitle ?? "",
      description: reward.description ?? "",
      pointsRequired: reward.pointsRequired,
      isPopular: reward.isPopular,
      isActive: reward.isActive,
      sortOrder: reward.sortOrder,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (!form.title || form.pointsRequired <= 0) {
        setError("Title and points are required, points must be > 0");
        return;
      }

      if (editingId) {
        await updateRewardApi(editingId, form);
      } else {
        await createRewardApi(form);
      }
      await loadRewards();
      resetForm();
    } catch (e: any) {
      setError(e.message || "Failed to save reward");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this reward? This cannot be undone.")) return;
    try {
      setDeleteLoadingId(id);
      setError(null);
      await deleteRewardApi(id);
      await loadRewards();
      if (editingId === id) {
        resetForm();
      }
    } catch (e: any) {
      setError(e.message || "Failed to delete reward");
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
    <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
      <div>
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Rewards & Benefits</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage loyalty rewards that users can redeem using their points.
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
                  Reward
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
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
              {rewards.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No rewards configured yet.
                  </td>
                </tr>
              ) : (
                rewards.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-900">{r.title}</div>
                      {r.subtitle && (
                        <div className="text-xs text-gray-500">{r.subtitle}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {r.pointsRequired.toLocaleString()} pts
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="flex flex-wrap gap-1">
                        {r.isPopular && (
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-700">
                            Popular
                          </span>
                        )}
                        {r.isActive ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => handleEdit(r)}
                        className="mr-2 text-[#8B0000] font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(r._id)}
                        disabled={deleteLoadingId === r._id}
                        className="text-red-600 font-semibold hover:text-red-800 hover:underline disabled:opacity-50"
                      >
                        {deleteLoadingId === r._id ? "Deleting..." : "Delete"}
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
                {editingId ? "Edit reward" : "Create reward"}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Configure title, description, required points and flags.
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
                Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                placeholder="Free Movie Ticket"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                placeholder="Most popular"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                placeholder="Redeem for a standard 2D ticket on any weekday show."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Points required<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.pointsRequired}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      pointsRequired: Number(e.target.value || 0),
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="2000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Sort order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: Number(e.target.value || 0),
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#8B0000] focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPopular: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#8B0000] focus:ring-[#8B0000]"
                />
                Mark as popular
              </label>
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
                  : "Create reward"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

