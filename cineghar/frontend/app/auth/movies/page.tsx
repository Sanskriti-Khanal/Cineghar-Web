"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { moviesApi, getImageUrl, Movie, MoviesResponse } from "@/lib/api/movies";
import Image from "next/image";
import Link from "next/link";
import { Star, Popcorn, TicketPercent, Crown, Gift } from "lucide-react";

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState<"popular" | "upcoming" | "search">("popular");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);

  const fetchMovies = async (
    type: "popular" | "upcoming" | "search",
    pageNum: number = 1,
  ) => {
    try {
      setLoading(true);
      setError(null);
      let response: MoviesResponse;

      if (type === "search") {
        if (!searchQuery.trim()) {
          setMovies([]);
          setLoading(false);
          return;
        }
        response = await moviesApi.searchMovies(searchQuery, pageNum);
      } else if (type === "popular") {
        response = await moviesApi.getPopularMovies(pageNum);
      } else {
        response = await moviesApi.getUpcomingMovies(pageNum);
      }

      setMovies(response.results);
      setTotalPages(response.total_pages);
      setPage(response.page);
    } catch (err: any) {
      setError(err.message || "Failed to fetch movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "search" && !searchQuery.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }
    fetchMovies(activeTab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("search");
      fetchMovies("search", 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchMovies(activeTab, newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredMovies =
    minRating != null
      ? movies.filter((movie) => movie.vote_average >= minRating)
      : movies;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050509] text-white">
        <Navbar />

        <main className="pt-16">
          {/* Header / Hero */}
          <section className="bg-gradient-to-br from-black via-[#111827] to-[#150308] pt-10 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
                    In Theaters Now
                  </p>
                  <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold">
                    Now Showing
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
                    Browse all movies currently playing at CineGhar, filter by
                    your favourite genres, and book your next cinematic night
                    out.
                  </p>
                </div>

                {/* Search Bar */}
                <form
                  onSubmit={handleSearch}
                  className="w-full max-w-md bg-black/40 rounded-2xl border border-white/10 p-2 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies by name..."
                    className="flex-1 px-3 py-2 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#A00000] text-xs sm:text-sm font-semibold hover:shadow-[0_12px_32px_rgba(0,0,0,0.9)] transition-shadow"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Tabs + Filters */}
              <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveTab("popular");
                      setSearchQuery("");
                    }}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === "popular"
                        ? "bg-[#8B0000] text-white"
                        : "bg-white/5 text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("upcoming");
                      setSearchQuery("");
                    }}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === "upcoming"
                        ? "bg-[#8B0000] text-white"
                        : "bg-white/5 text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Filters / Sorting */}
                <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                  <select
                    className="bg-black/40 border border-white/20 rounded-full px-3 py-1.5 text-gray-200 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Genre
                    </option>
                    <option>All</option>
                    <option>Action</option>
                    <option>Drama</option>
                    <option>Romance</option>
                    <option>Sci‑Fi</option>
                  </select>
                  <select
                    className="bg-black/40 border border-white/20 rounded-full px-3 py-1.5 text-gray-200 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Language
                    </option>
                    <option>All</option>
                    <option>English</option>
                    <option>Nepali</option>
                    <option>Hindi</option>
                  </select>
                  <select
                    className="bg-black/40 border border-white/20 rounded-full px-3 py-1.5 text-gray-200 focus:outline-none"
                    value={minRating ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMinRating(v ? Number(v) : null);
                    }}
                  >
                    <option value="">All ratings</option>
                    <option value="7">7.0+</option>
                    <option value="8">8.0+</option>
                  </select>
                  <select
                    className="bg-black/40 border border-white/20 rounded-full px-3 py-1.5 text-gray-200 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Showtime
                    </option>
                    <option>All</option>
                    <option>Matinee</option>
                    <option>Evening</option>
                    <option>Late Night</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Movies Grid */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-[#0b0b11] to-[#050509]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]" />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {!loading && !error && filteredMovies.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-300 text-lg">
                    No movies found. Try a different search or filter.
                  </p>
                </div>
              )}

              {!loading && filteredMovies.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.85)] hover:border-[#8B0000]/70 hover:-translate-y-1 transition-all duration-200 flex flex-col"
                      >
                        <Link
                          href={`/auth/movies/${movie.id}`}
                          className="flex-1 flex flex-col"
                        >
                          <div className="relative aspect-[2/3] bg-black">
                            {getImageUrl(movie.poster_path) ? (
                              <Image
                                src={getImageUrl(movie.poster_path)!}
                                alt={movie.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-500">
                                <div className="text-center p-4 text-xs text-gray-200">
                                  No Poster
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-[10px]">
                              <span>⭐ {movie.vote_average.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="p-3 flex-1 flex flex-col gap-1">
                            <h3 className="font-semibold text-sm line-clamp-2">
                              {movie.title}
                            </h3>
                            <p className="text-[11px] text-gray-300">
                              Feature film • 2h 10m
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {movie.theater_release_date
                                ? new Date(
                                    movie.theater_release_date,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : movie.release_date
                                ? new Date(
                                    movie.release_date,
                                  ).getFullYear()
                                : "Coming soon"}
                            </p>
                            {movie.release_status && (
                              <span
                                className={`inline-flex items-center mt-1 text-[10px] px-2 py-0.5 rounded-full ${
                                  movie.theater_available
                                    ? "bg-green-500/20 text-green-200"
                                    : movie.release_status === "TBA"
                                    ? "bg-gray-500/20 text-gray-200"
                                    : "bg-yellow-500/20 text-yellow-100"
                                }`}
                              >
                                {movie.theater_available
                                  ? "In Theaters"
                                  : movie.release_status}
                              </span>
                            )}
                          </div>
                        </Link>

                        <div className="px-3 pb-3 flex items-center justify-between gap-2">
                          <button className="flex-1 text-[11px] px-3 py-1.5 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white font-semibold hover:shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-shadow">
                            Book Now
                          </button>
                          <Link
                            href={`/auth/movies/${movie.id}`}
                            className="text-[11px] px-3 py-1.5 rounded-full border border-white/25 text-white/90 hover:bg-white/10 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-10 text-sm">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Promotions / Loyalty Highlights */}
          <section className="py-10 bg-gradient-to-b from-[#050509] via-black to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Make every booking count
                  </h2>
                  <p className="mt-1 text-sm text-gray-300 max-w-xl">
                    Earn CineGhar points on every ticket and unlock free shows,
                    snack upgrades and premiere access.
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="font-semibold mb-1">2x Weekday Points</p>
                    <p className="text-gray-300">
                      Book Monday–Thursday shows and earn double loyalty
                      points.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="font-semibold mb-1">Snack Combos</p>
                    <p className="text-gray-300">
                      Redeem points for popcorn & drink bundles at member
                      rates.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
                    <p className="font-semibold mb-1">VIP Premieres</p>
                    <p className="text-gray-300">
                      Gold & Platinum members get early access to red‑carpet
                      premieres.
                    </p>
                  </div>
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

