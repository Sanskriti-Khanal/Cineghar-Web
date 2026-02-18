"use client";

import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { TicketPercent, Popcorn, Crown, Gift, Film } from "lucide-react";

export default function SalesPage() {
  const featuredOffers = [
    {
      title: "Mid‑Week Ticket Madness",
      description:
        "Save up to 30% on Wednesday evening shows for all CineGhar members.",
      validity: "Valid every Wednesday this month",
      cta: "Book Now",
      tag: "Limited time",
      type: "Movie Tickets",
    },
    {
      title: "Gold & Platinum Premiere Access",
      description:
        "Early booking window and reserved rows for upcoming blockbuster premieres.",
      validity: "Exclusive to Gold & Platinum tiers",
      cta: "View Premieres",
      tag: "Members only",
      type: "Loyalty Rewards",
    },
  ];

  const promotions = [
    {
      title: "Snack Combo Upgrade",
      description:
        "Large popcorn + drink combo at a special member price. Earn extra points on every combo.",
      validity: "Ends Feb 28, 2026",
      cta: "Claim Offer",
      type: "Combo Snacks",
    },
    {
      title: "Morning Matinee Discounts",
      description:
        "Early morning shows at flat discounted prices for families and students.",
      validity: "Weekdays, before 11:00 AM",
      cta: "Book Matinee",
      type: "Movie Tickets",
    },
    {
      title: "Referral Bonus",
      description:
        "Invite a friend and both of you earn bonus loyalty points after their first booking.",
      validity: "Ongoing",
      cta: "Share Invite",
      type: "Loyalty Rewards",
    },
    {
      title: "Weekend Double Points",
      description:
        "Earn 2x points on tickets for Friday and Saturday late‑night shows.",
      validity: "Fridays & Saturdays after 8:00 PM",
      cta: "View Showtimes",
      type: "Movie Tickets",
    },
  ];

  const categories = ["All", "Movie Tickets", "Combo Snacks", "Loyalty Rewards"];

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
                    Deals & Promotions
                  </p>
                  <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
                    Sales & Offers
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
                    Discover current cinema deals, snack offers, and loyalty
                    rewards available exclusively for CineGhar members.
                  </p>
                </div>

                <div className="rounded-2xl bg-black/40 border border-white/15 px-4 py-3 text-xs text-gray-200 max-w-sm">
                  <p>
                    New offers are added every week. Check back often to make
                    the most of your next{" "}
                    <span className="font-semibold text-[#F97373]">
                      movie night out
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Category filters + featured offers */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#0b0b11] to-[#050509]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Category filters (visual only for now) */}
              <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-4 py-1.5 rounded-full border border-white/15 bg-black/40 text-gray-200 hover:bg-white/10 hover:border-[#8B0000]/70 transition-colors`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Featured offers */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Featured Offers
                </h2>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  {featuredOffers.map((offer) => (
                    <div
                      key={offer.title}
                      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#111827] to-[#150308] border border-white/15 shadow-[0_22px_55px_rgba(0,0,0,0.9)] hover:border-[#8B0000]/80 hover:-translate-y-1 transition-all duration-200 p-6 flex flex-col gap-4"
                    >
                      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#8B0000]/40 blur-3xl" />
                      <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-[#F97373]/25 blur-3xl" />

                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-300">
                            {offer.tag}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold">
                            {offer.title}
                          </h3>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 text-[11px]">
                          <TicketPercent size={16} className="text-[#F97373]" />
                          <span>Featured</span>
                        </div>
                      </div>

                      <p className="relative z-10 text-xs sm:text-sm text-gray-200">
                        {offer.description}
                      </p>

                      <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                        <p className="text-gray-300">
                          <span className="font-semibold">Valid: </span>
                          {offer.validity}
                        </p>
                        <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-[11px] sm:text-xs font-semibold hover:shadow-[0_12px_32px_rgba(0,0,0,0.9)] transition-shadow">
                          {offer.cta}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* All promotions grid */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Current Promotions
                </h2>
                <p className="text-xs text-gray-400">
                  Active deals across tickets, snacks and loyalty rewards
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
                {promotions.map((promo) => (
                  <div
                    key={promo.title}
                    className="group rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{promo.title}</p>
                      <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px] text-gray-200">
                        {promo.type}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs">{promo.description}</p>
                    <p className="text-[11px] text-gray-400">
                      <span className="font-semibold">Valid: </span>
                      {promo.validity}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-[11px] font-semibold hover:shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-shadow">
                        {promo.cta}
                      </button>
                      <span className="text-[11px] text-gray-300">
                        Terms apply
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How to avail section */}
          <section className="py-10 bg-gradient-to-b from-[#020105] via-black to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    How to Avail Offers
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-xl">
                    Redeeming CineGhar offers is simple and seamless, whether
                    you book online or at the theater.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/50 border border-white/15 text-[11px]">
                    <Film size={14} />
                    <span>Step 1</span>
                  </div>
                  <p className="font-semibold mt-1">Choose an offer</p>
                  <p className="text-gray-300">
                    Browse Sales & Offers and pick any active promotion that
                    fits your movie night.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/50 border border-white/15 text-[11px]">
                    <TicketPercent size={14} />
                    <span>Step 2</span>
                  </div>
                  <p className="font-semibold mt-1">Apply while booking</p>
                  <p className="text-gray-300">
                    Click &quot;Book Now&quot; or &quot;Claim Offer&quot; to
                    apply it directly to your tickets or snack combos.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/50 border border-white/15 text-[11px]">
                    <Gift size={14} />
                    <span>Step 3</span>
                  </div>
                  <p className="font-semibold mt-1">Enjoy & earn</p>
                  <p className="text-gray-300">
                    Complete your visit and continue to earn loyalty points on
                    top of your redeemed offers.
                  </p>
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
                    <p className="font-semibold mb-2 text.white">
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

