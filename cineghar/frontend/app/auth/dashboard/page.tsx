import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import Image from "next/image";
import { Film, Star, Popcorn, TicketPercent, Crown, Gift } from "lucide-react";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050509] text-white">
        <Navbar />

        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative min-h-[80vh] flex items-center justify-start overflow-hidden">
            {/* Hero Image - Full Background */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/newhero.png"
                alt="Featured Movies"
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Dark Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-[#150308]" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
              <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 items-center">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
                    Welcome back to CineGhar
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#B91C1C] via-[#F97373] to-[#FACC15]">
                      Cinematic Dashboard
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-200 max-w-xl">
                    Continue watching, discover new releases, track your loyalty
                    points and never miss exclusive CineGhar offers.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button className="px-7 py-3 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white text-sm font-semibold shadow-[0_18px_45px_rgba(0,0,0,0.7)] hover:shadow-[0_22px_55px_rgba(0,0,0,0.9)] hover:scale-[1.02] transition-all">
                      Browse Movies
                    </button>
                    <button className="px-7 py-3 rounded-full border border-white/30 text-sm font-semibold text-white/90 bg-white/5 hover:bg-white/10 transition-colors">
                      View Loyalty Points
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-5 pt-6 border-t border-white/10 max-w-md">
                    <div>
                      <p className="text-2xl font-semibold">128</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Movies watched
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">2,450</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Loyalty points
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold flex items-center gap-1">
                        4.8 <Star size={16} className="text-yellow-300" />
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Avg. rating
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured movie stack */}
                <div className="hidden lg:block">
                  <div className="relative w-full max-w-md ml-auto">
                    <div className="absolute -top-6 -left-10 w-40 h-40 rounded-full bg-[#8B0000]/40 blur-3xl" />
                    <div className="absolute -bottom-10 -right-12 w-52 h-52 rounded-full bg-[#F97373]/30 blur-3xl" />

                    <div className="relative bg-black/70 border border-white/10 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                            <Film size={14} /> Featured Tonight
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          Ultra HD • Atmos
                        </span>
                      </div>

                      <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent z-10" />
                        <Image
                          src="/images/newhero.png"
                          alt="Featured movie"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-3 left-3 z-20">
                          <p className="text-sm font-semibold mb-1">
                            The Dark Knight
                          </p>
                          <p className="text-[11px] text-gray-300">
                            Action • Thriller • 2h 32m
                          </p>
                        </div>
                        <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-xs">
                          <Star size={14} className="text-yellow-300" />
                          4.9
                        </div>
                      </div>

                      <div className="space-y-3 text-xs text-gray-300">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                          Up next
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">Inception</p>
                              <p className="text-[11px] text-gray-400">
                                Sci‑Fi • Mystery
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px]">
                              4.8 ★
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                Interstellar
                              </p>
                              <p className="text-[11px] text-gray-400">
                                Sci‑Fi • Drama
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px]">
                              4.7 ★
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Movies Section */}
          <section className="py-12 md:py-16 bg-gradient-to-b from-[#050509] via-[#0b0b11] to-[#050509]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    Trending & New Releases
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Hand‑picked movies we think you&apos;ll love tonight.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "The Dark Knight",
                    meta: "Action • Thriller",
                    rating: "4.9",
                  },
                  {
                    title: "Inception",
                    meta: "Sci‑Fi • Mystery",
                    rating: "4.8",
                  },
                  {
                    title: "Dune: Part Two",
                    meta: "Sci‑Fi • Adventure",
                    rating: "4.7",
                  },
                  {
                    title: "La La Land",
                    meta: "Romance • Musical",
                    rating: "4.6",
                  },
                ].map((movie) => (
                  <div
                    key={movie.title}
                    className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.75)] hover:translate-y-[-2px] hover:border-[#8B0000]/70 transition-all duration-200"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-[#111827] to-[#0b0b11]">
                      <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity">
                        <div className="w-full h-full bg-gradient-to-tr from-[#8B0000] via-[#1f2937] to-[#111827]" />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{movie.title}</p>
                          <p className="text-[11px] text-gray-200">
                            {movie.meta}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-[11px]">
                          <Star size={14} className="text-yellow-300" />
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-xs text-gray-300">
                        Premium • Dolby Atmos
                      </p>
                      <button className="text-[11px] px-3 py-1 rounded-full border border-white/20 text-white/90 hover:bg-white/10 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Loyalty Points Section */}
          <section className="py-12 md:py-16 bg-gradient-to-b from-[#0b0b11] via-[#050509] to-[#050509]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 items-stretch">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    Loyalty Points & Rewards
                  </h2>
                  <p className="text-sm text-gray-300 max-w-xl">
                    Earn CineGhar points on every ticket, snack and stream.
                    Redeem them for free tickets, upgrades and exclusive
                    premieres.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs text-gray-400">Current balance</p>
                      <p className="mt-2 text-2xl font-semibold">2,450 pts</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        You&apos;re 550 pts away from a free ticket.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs text-gray-400">Tier</p>
                      <p className="mt-2 text-2xl font-semibold flex items-center gap-1">
                        Gold
                        <Crown size={18} className="text-yellow-300" />
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        1.5x points on all bookings.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs text-gray-400">This month</p>
                      <p className="mt-2 text-2xl font-semibold">620 pts</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Earned from 4 visits and 2 online streams.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl bg-gradient-to-br from-black via-[#111827] to-[#150308] border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
                  <h3 className="text-sm font-semibold mb-1">
                    How to earn more points
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-start gap-2">
                      <Popcorn size={14} className="mt-[2px] text-[#FACC15]" />
                      <span>
                        <span className="font-medium">Snacks & Drinks</span> –
                        2 pts for every Rs. 100 spent at the concession stand.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TicketPercent
                        size={14}
                        className="mt-[2px] text-[#F97373]"
                      />
                      <span>
                        <span className="font-medium">Weekday shows</span> –
                        earn 1.5x points on all Mon–Thu screenings.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Gift size={14} className="mt-[2px] text-[#A78BFA]" />
                      <span>
                        <span className="font-medium">Special events</span> –
                        double points on premieres and festival screenings.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Sales / Offers Section */}
          <section className="py-12 md:py-16 bg-gradient-to-b from-[#050509] via-[#08080e] to-[#020105]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">
                    Current Sales & Offers
                  </h2>
                  <p className="text-sm text-gray-300 mt-1 max-w-xl">
                    Make every visit count with exclusive discounts and
                    member‑only promotions.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-2 mb-2">
                    <TicketPercent size={18} className="text-[#F97373]" />
                    <p className="font-semibold">Mid‑Week Ticket Deals</p>
                  </div>
                  <p className="text-gray-300 text-xs mb-2">
                    Up to 30% off on Wednesday evening shows for CineGhar
                    members.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Applies to shows after 5 PM.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Popcorn size={18} className="text-[#FACC15]" />
                    <p className="font-semibold">Snacks Combo Savings</p>
                  </div>
                  <p className="text-gray-300 text-xs mb-2">
                    Redeem points for popcorn & drinks combos at a special
                    member price.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Combos from just 120 pts.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown size={18} className="text-yellow-300" />
                    <p className="font-semibold">VIP Premiere Access</p>
                  </div>
                  <p className="text-gray-300 text-xs mb-2">
                    Gold & Platinum members get early booking on red‑carpet
                    premieres.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Look for the “VIP” tag in show listings.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift size={18} className="text-[#A78BFA]" />
                    <p className="font-semibold">Birthday Rewards</p>
                  </div>
                  <p className="text-gray-300 text-xs mb-2">
                    Celebrate with bonus points and a complimentary movie ticket
                    during your birthday month.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Check your email for your birthday code.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Footer */}
          <footer className="border-t border-white/10 bg-black/95 text-white">
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                <div>
                  <p className="text-lg font-semibold">CineGhar</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Premium cinematic experiences, curated for true movie
                    lovers.
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
