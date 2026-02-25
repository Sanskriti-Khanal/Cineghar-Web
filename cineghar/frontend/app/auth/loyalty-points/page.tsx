"use client";

import { useEffect, useMemo, useState } from "react";

import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { Crown, Popcorn, TicketPercent, Gift, Star, Film } from "lucide-react";
import { getMyLoyaltyApi, type LoyaltyTransaction } from "@/lib/api/loyalty";
import { getActiveOffersApi, type ActiveOffer } from "@/lib/api/offers";
import { getRewardsApi, type Reward } from "@/lib/api/rewards";
import { getSnackItemsApi, getSnackCombosApi, type SnackItem, type SnackCombo } from "@/lib/api/snacks";
import { getImageUrl } from "@/lib/utils";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString();
}

function getTier(points: number): string {
  if (points >= 5000) return "Platinum";
  if (points >= 2000) return "Gold";
  if (points >= 1000) return "Silver";
  return "Member";
}

export default function LoyaltyPointsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [offers, setOffers] = useState<ActiveOffer[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [snackItems, setSnackItems] = useState<SnackItem[]>([]);
  const [snackCombos, setSnackCombos] = useState<SnackCombo[]>([]);

  const thisMonthPoints = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return transactions.reduce((sum, tx) => {
      const d = new Date(tx.createdAt);
      if (!Number.isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month && tx.change > 0) {
        return sum + tx.change;
      }
      return sum;
    }, 0);
  }, [transactions]);

  const tier = useMemo(() => getTier(currentPoints), [currentPoints]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [meRes, offersRes, rewardsRes, itemsRes, combosRes] = await Promise.all([
          getMyLoyaltyApi(),
          getActiveOffersApi(),
          getRewardsApi(),
          getSnackItemsApi(),
          getSnackCombosApi(),
        ]);

        if (meRes.success && meRes.data) {
          setCurrentPoints(meRes.data.loyaltyPoints);
          setTransactions(meRes.data.recentTransactions ?? []);
        } else if (!meRes.success && meRes.message) {
          setError(meRes.message);
        }

        if (offersRes.success) {
          setOffers(offersRes.data ?? []);
        }

        if (rewardsRes.success) {
          setRewards(rewardsRes.data ?? []);
        }

        if (itemsRes.success) {
          setSnackItems(itemsRes.data ?? []);
        }

        if (combosRes.success) {
          setSnackCombos(combosRes.data ?? []);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load loyalty data.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050509] text-white">
        <Navbar />

        <main className="pt-16">
          {/* Page header */}
          <section className="bg-gradient-to-br from-black via-[#111827] to-[#150308] pt-10 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
                    Rewards Centre
                  </p>
                  <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
                    Loyalty Points
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
                    Turn every ticket, snack and stream into rewards. Track your
                    balance, redeem benefits, and level up your CineGhar status.
                  </p>
                </div>

                {/* Summary tag line */}
                <div className="rounded-2xl bg-black/40 border border-white/15 px-4 py-3 text-xs text-gray-200 max-w-sm">
                  <p>
                    As a <span className="font-semibold">{tier}</span> member
                    you earn{" "}
                    <span className="font-semibold text-[#F97373]">
                      1.5x points
                    </span>{" "}
                    on every booking.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Points summary + how to earn */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#0b0b11] to-[#050509]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 items-stretch">
                {/* Points summary card */}
                <div className="rounded-3xl bg-gradient-to-br from-black via-[#111827] to-[#150308] border border-white/15 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                        Current balance
                      </p>
                      <p className="mt-3 text-4xl font-semibold flex items-center gap-2">
                        {loading ? "…" : currentPoints.toLocaleString()} pts{" "}
                        <Star size={20} className="text-yellow-300" />
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        You&apos;re{" "}
                        <span className="font-semibold text-gray-200">
                          {Math.max(0, 3000 - currentPoints).toLocaleString()} pts
                        </span>{" "}
                        away from a free premiere ticket.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 border border-yellow-400/40 text-xs">
                      <Crown size={16} className="text-yellow-300" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold">{tier} member</span>
                        <span className="text-[10px] text-gray-300">
                          1.5x on tickets
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs text-gray-400">This month</p>
                      <p className="mt-2 text-2xl font-semibold">
                        {loading ? "…" : thisMonthPoints}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Earned from recent visits and online streams.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs text-gray-400">Tickets booked</p>
                      <p className="mt-2 text-2xl font-semibold">18</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Across the last 3 months.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs text-gray-400">Rewards redeemed</p>
                      <p className="mt-2 text-2xl font-semibold">6</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Free tickets & snack bundles so far.
                      </p>
                    </div>
                  </div>
                </div>

                {/* How to earn points */}
                <div className="space-y-4 rounded-3xl bg-gradient-to-br from-black via-[#111827] to-[#150308] border border-white/15 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                  <p className="text-sm font-semibold mb-1">
                    How to earn more points
                  </p>
                  <ul className="space-y-3 text-xs text-gray-200">
                    <li className="flex items-start gap-3">
                      <TicketPercent
                        size={18}
                        className="mt-[2px] text-[#F97373]"
                      />
                      <div>
                        <p className="font-medium">Book movie tickets</p>
                        <p className="text-gray-400">
                          Earn 5 pts for every ticket you book.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Popcorn
                        size={18}
                        className="mt-[2px] text-[#FACC15]"
                      />
                      <div>
                        <p className="font-medium">Snacks & combos</p>
                        <p className="text-gray-400">
                          Collect extra pts when you buy popcorn, drinks, and
                          special combo deals.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Film size={18} className="mt-[2px] text-[#93C5FD]" />
                      <div>
                        <p className="font-medium">Streaming & on-demand</p>
                        <p className="text-gray-400">
                          Earn points for every completed movie on the CineGhar
                          web platform.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Gift size={18} className="mt-[2px] text-[#A78BFA]" />
                      <div>
                        <p className="font-medium">Referrals & milestones</p>
                        <p className="text-gray-400">
                          Invite friends and unlock referral bonuses and
                          milestone achievements.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Rewards & benefits (from active offers configured in admin) */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Available Rewards
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-xl">
                    Redeem your points for exclusive rewards and benefits. These rewards are configured in the admin dashboard.
                  </p>
                </div>
              </div>

              {rewards.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No rewards are available yet. Check back later or contact support.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  {rewards.map((reward) => (
                    <div
                      key={reward._id}
                      className={`group rounded-2xl border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] transition-all duration-200 flex flex-col gap-3 ${
                        reward.pointsRequired <= currentPoints
                          ? "bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30 hover:border-green-400/50"
                          : "bg-white/5 border-white/10 hover:border-[#8B0000]/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{reward.title}</p>
                          {reward.subtitle && (
                            <p className="text-xs text-gray-400 mt-1">{reward.subtitle}</p>
                          )}
                        </div>
                        {reward.isPopular && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                            Popular
                          </span>
                        )}
                      </div>
                      {reward.description && (
                        <p className="text-[11px] text-gray-300">
                          {reward.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium">
                          {reward.pointsRequired.toLocaleString()} pts
                        </span>
                        {reward.pointsRequired <= currentPoints ? (
                          <span className="text-green-400 font-medium">Available</span>
                        ) : (
                          <span className="text-gray-400">
                            Need {Math.max(0, reward.pointsRequired - currentPoints).toLocaleString()} more pts
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Current Offers */}
          <section className="py-10 bg-gradient-to-b from-[#020105] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Current Offers
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-xl">
                    Special discount codes and promotions. Apply these codes during checkout.
                  </p>
                </div>
              </div>

              {offers.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No active offers are available at the moment.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                  {offers.map((offer) => (
                    <div
                      key={offer._id}
                      className="group rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm">{offer.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B0000]/30 text-white">
                          Code: {offer.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">
                        {offer.description || "Apply this offer code at checkout to redeem benefits."}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-gray-200">
                        <span>
                          {offer.type === "percentage_discount" && offer.discountPercent != null
                            ? `${offer.discountPercent}% off`
                            : offer.discountAmount != null
                            ? `NPR ${offer.discountAmount.toLocaleString()} off`
                            : "Special reward"}
                        </span>
                        {offer.minSpend != null && (
                          <span className="text-[11px] text-gray-300">
                            Min spend NPR {offer.minSpend.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Snacks & Beverages */}
          <section className="py-10 bg-gradient-to-b from-[#020105] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Snacks & Beverages
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-xl">
                    Enjoy our delicious snacks and refreshing beverages. Available for purchase during movie bookings.
                  </p>
                </div>
              </div>

              {/* Snack Items */}
              {snackItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Individual Items</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    {snackItems.map((item) => (
                      <div
                        key={item._id}
                        className="group rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
                      >
                        {item.imageUrl && (
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              item.category === 'veg' ? 'bg-green-500/20 text-green-300' :
                              item.category === 'nonveg' ? 'bg-red-500/20 text-red-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-gray-300 mb-2">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm font-medium text-white">
                            NPR {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Snack Combos */}
              {snackCombos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Combo Deals</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    {snackCombos.map((combo) => (
                      <div
                        key={combo._id}
                        className="group rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
                      >
                        {combo.imageUrl && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                            <img
                              src={getImageUrl(combo.imageUrl)}
                              alt={combo.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm">{combo.name}</p>
                            {combo.discountLabel && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
                                {combo.discountLabel}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-300 mb-2">
                            {combo.itemsPreview}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">
                              NPR {combo.price.toLocaleString()}
                            </span>
                            {combo.originalPrice && combo.originalPrice > combo.price && (
                              <span className="text-xs text-gray-400 line-through">
                                NPR {combo.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {snackItems.length === 0 && snackCombos.length === 0 && (
                <p className="text-sm text-gray-400">
                  No snacks are available at the moment. Check back later.
                </p>
              )}
            </div>
          </section>

          {/* Recent activity */}
          <section className="py-10 bg-gradient-to-b from-[#020105] via-black to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <p className="text-xs text-gray-400">
                  Last 30 days of points earned & redeemed
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden text-xs sm:text-sm">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] px-4 py-2 bg-black/60 text-gray-300">
                  <span>Description</span>
                  <span>Date</span>
                  <span className="text-right">Points</span>
                </div>
                <div>
                  {transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] px-4 py-2 border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{tx.reason}</p>
                        <p className="text-[11px] text-gray-400">
                          {tx.change > 0 ? "Earned" : "Redeemed"}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-300">
                        {formatDate(tx.createdAt)}
                      </div>
                      <div className="flex items-center justify-end">
                        <span
                          className={`font-semibold ${
                            tx.change > 0
                              ? "text-emerald-300"
                              : "text-rose-300"
                          }`}
                        >
                          {tx.change > 0 ? `+${tx.change}` : tx.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer (dashboard-style) */}
          <footer className="border-t border-white/10 bg-black/95 text-white">
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                <div>
                  <p className="text-lg font-semibold">CineGhar</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Premium movie experiences, curated for you.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-300">
                  <div>
                    <p className="font-semibold mb-2 text-white">Contact</p>
                    <p>support@cineghar.com</p>
                    <p>+977‑1‑2345678</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-white">
                      Quick Navigation
                    </p>
                    <p>Home</p>
                    <p>Movies</p>
                    <p>Loyalty Points</p>
                    <p>Sales & Offers</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-white">
                      Follow Us
                    </p>
                    <p>Facebook</p>
                    <p>Instagram</p>
                    <p>Twitter / X</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-gray-500 text-center">
                © {new Date().getFullYear()} CineGhar. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  );
}

