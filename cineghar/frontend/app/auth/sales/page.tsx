 "use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { TicketPercent, Popcorn, Crown, Gift, Film } from "lucide-react";
import { getActiveOffersApi, type ActiveOffer } from "@/lib/api/offers";

export default function SalesPage() {
  const [offers, setOffers] = useState<ActiveOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getActiveOffersApi();
        if (res.success) {
          setOffers(res.data ?? []);
        } else if (res.message) {
          setError(res.message);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load active offers.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const featuredOffers = offers.slice(0, 2);
  const remainingOffers = offers.slice(2);

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
                    Deals &amp; Promotions
                  </p>
                  <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
                    Sales &amp; Offers
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
                    Discover cinema deals, snack offers, and loyalty rewards configured in your admin dashboard.
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Featured offers (from active offers configured in admin) */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#0b0b11] to-[#050509]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">Featured Offers</h2>
                {loading ? (
                  <p className="text-sm text-gray-300">Loading offers…</p>
                ) : featuredOffers.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No active offers are configured yet. Create offers from the admin Offers dashboard.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    {featuredOffers.map((offer) => (
                      <div
                        key={offer._id}
                        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-[#111827] to-[#150308] border border-white/15 shadow-[0_22px_55px_rgba(0,0,0,0.9)] hover:border-[#8B0000]/80 hover:-translate-y-1 transition-all duration-200 p-6 flex flex-col gap-4"
                      >
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#8B0000]/40 blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-[#F97373]/25 blur-3xl" />

                        <div className="relative z-10 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-300">
                              Offer code: {offer.code}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold">{offer.name}</h3>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 text-[11px]">
                            <TicketPercent size={16} className="text-[#F97373]" />
                            <span>Featured</span>
                          </div>
                        </div>

                        <p className="relative z-10 text-xs sm:text-sm text-gray-200">
                          {offer.description ||
                            "Apply this offer code at checkout to redeem the discount."}
                        </p>

                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-gray-200">
                          <p>
                            {offer.type === "percentage_discount" && offer.discountPercent != null
                              ? `${offer.discountPercent}% off`
                              : offer.discountAmount != null
                              ? `NPR ${offer.discountAmount.toLocaleString()} off`
                              : "Special offer"}
                          </p>
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
            </div>
          </section>

          {/* All promotions grid (remaining offers) */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Current Promotions</h2>
                <p className="text-xs text-gray-400">
                  Active deals configured in the admin Offers dashboard
                </p>
              </div>

              {!loading && remainingOffers.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
                  {remainingOffers.map((offer) => (
                    <div
                      key={offer._id}
                      className="group rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm">{offer.name}</p>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px] text-gray-200">
                          Code: {offer.code}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs">
                        {offer.description || "Use this offer code at checkout."}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {offer.minSpend != null && (
                          <>
                            <span className="font-semibold">Min spend: </span>
                            NPR {offer.minSpend.toLocaleString()}
                          </>
                        )}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-gray-300">
                          {offer.type === "percentage_discount" && offer.discountPercent != null
                            ? `${offer.discountPercent}% off`
                            : offer.discountAmount != null
                            ? `NPR ${offer.discountAmount.toLocaleString()} off`
                            : "Special"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    Redeeming CineGhar offers is simple and seamless, whether you book
                    online or at the theater.
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
                    Browse Sales &amp; Offers and pick any active promotion that fits your
                    movie night.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/50 border border-white/15 text-[11px]">
                    <TicketPercent size={14} />
                    <span>Step 2</span>
                  </div>
                  <p className="font-semibold mt-1">Apply while booking</p>
                  <p className="text-gray-300">
                    Enter the offer code during checkout to apply it directly to your
                    tickets or snack combos.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-2">
                  <div className="inline-flex.items-center gap-2 px-2 py-1 rounded-full bg-black/50 border border-white/15 text-[11px]">
                    <Gift size={14} />
                    <span>Step 3</span>
                  </div>
                  <p className="font-semibold mt-1">Enjoy &amp; earn</p>
                  <p className="text-gray-300">
                    Complete your visit and continue to earn loyalty points on top of your
                    redeemed offers.
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
                    <p className="font-semibold mb-2 text-white">Quick Navigation</p>
                    <p>Home</p>
                    <p>Movies</p>
                    <p>Loyalty Points</p>
                    <p>Sales &amp; Offers</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-white">Follow Us</p>
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

