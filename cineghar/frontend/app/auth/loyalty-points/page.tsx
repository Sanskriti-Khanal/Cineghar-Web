"use client";

import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { Crown, Popcorn, TicketPercent, Gift, Star, Film } from "lucide-react";

export default function LoyaltyPointsPage() {
  // Static demo data for now – can be wired to backend later
  const currentPoints = 2450;
  const tier = "Gold";
  const thisMonthPoints = 620;

  const rewards = [
    {
      title: "Free Movie Ticket",
      cost: "2,000 pts",
      description: "Redeem for a standard 2D ticket on any weekday show.",
      tag: "Most popular",
    },
    {
      title: "Seat Upgrade to Premium",
      cost: "1,200 pts",
      description: "Upgrade to recliner or premium row seating.",
      tag: "Comfort upgrade",
    },
    {
      title: "Popcorn & Drink Combo",
      cost: "900 pts",
      description: "Large popcorn + soft drink at a special member price.",
      tag: "Snacks deal",
    },
    {
      title: "Premiere Night Access",
      cost: "3,500 pts",
      description: "Exclusive access to red‑carpet premiere screenings.",
      tag: "VIP only",
    },
  ];

  const recentActivity = [
    {
      label: "Inception – Evening show",
      change: "+120 pts",
      date: "Feb 20, 2026",
      type: "Earned",
    },
    {
      label: "Snack combo redemption",
      change: "-900 pts",
      date: "Feb 14, 2026",
      type: "Redeemed",
    },
    {
      label: "Referral bonus",
      change: "+500 pts",
      date: "Feb 10, 2026",
      type: "Earned",
    },
    {
      label: "Interstellar – Matinee show",
      change: "+140 pts",
      date: "Feb 2, 2026",
      type: "Earned",
    },
  ];

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
              <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 items-stretch">
                {/* Points summary card */}
                <div className="rounded-3xl bg-gradient-to-br from-black via-[#111827] to-[#150308] border border-white/15 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                        Current balance
                      </p>
                      <p className="mt-3 text-4xl font-semibold flex items-center gap-2">
                        {currentPoints.toLocaleString()} pts{" "}
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
                        {thisMonthPoints}
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
                          Earn 10 pts for every Rs. 100 spent on tickets. Gold
                          members get 1.5x.
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

          {/* Rewards & benefits */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Rewards & Benefits
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-xl">
                    Redeem your hard‑earned points for premium experiences,
                    snacks, and exclusive premieres.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                {rewards.map((reward) => (
                  <div
                    key={reward.title}
                    className="group rounded-2xl bg-white/5 border border.white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{reward.title}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B0000]/30 text-white">
                        {reward.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      {reward.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-200">
                        <span className="font-semibold">{reward.cost}</span>
                      </p>
                      <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-[11px] font-semibold hover:shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-shadow">
                        Redeem Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                  {recentActivity.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] px-4 py-2 border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-[11px] text-gray-400">{item.type}</p>
                      </div>
                      <div className="flex items-center text-gray-300">
                        {item.date}
                      </div>
                      <div className="flex items-center justify-end">
                        <span
                          className={`font-semibold ${
                            item.change.startsWith("+")
                              ? "text-emerald-300"
                              : "text-rose-300"
                          }`}
                        >
                          {item.change}
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

