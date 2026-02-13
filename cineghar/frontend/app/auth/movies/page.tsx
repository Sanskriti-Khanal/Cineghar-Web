"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { moviesApi, getImageUrl, Movie, MoviesResponse } from "@/lib/api/movies";
import Image from "next/image";
import Link from "next/link";

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState<"popular" | "upcoming" | "search">("popular");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMovies = async (type: "popular" | "upcoming" | "search", pageNum: number = 1) => {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Explore Movies
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for movies..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors font-semibold"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setActiveTab("popular");
                    setSearchQuery("");
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === "popular"
                      ? "bg-[#8B0000] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => {
                    setActiveTab("upcoming");
                    setSearchQuery("");
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === "upcoming"
                      ? "bg-[#8B0000] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  Upcoming in Theaters
                </button>
              </div>
              {activeTab === "upcoming" && (
                <p className="text-sm text-white/80">
                  Worldwide releases across all languages
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No movies found. Try a different search.</p>
            </div>
          )}

          {!loading && movies.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/auth/movies/${movie.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 mb-2">
                      {getImageUrl(movie.poster_path) ? (
                        <Image
                          src={getImageUrl(movie.poster_path)!}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                          <div className="text-center p-4">
                            <svg className="w-12 h-12 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <p className="text-xs text-gray-600 font-medium">No Image</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <span className="bg-[#8B0000] px-2 py-1 rounded">⭐ {movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#8B0000] transition-colors line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        {movie.theater_release_date 
                          ? new Date(movie.theater_release_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : movie.release_date 
                            ? new Date(movie.release_date).getFullYear()
                            : 'TBA'}
                      </p>
                      {movie.release_status && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          movie.theater_available 
                            ? 'bg-green-100 text-green-700' 
                            : movie.release_status === 'TBA'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {movie.theater_available ? 'In Theaters' : movie.release_status}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
