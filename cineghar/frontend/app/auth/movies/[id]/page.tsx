"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { moviesApi, getImageUrl, MovieDetails } from "@/lib/api/movies";
import Image from "next/image";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(movieId)) {
      setError("Invalid movie ID");
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await moviesApi.getMovieDetails(movieId);
        setMovie(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !movie) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error || "Movie not found"}
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section with Backdrop */}
        <div className="relative h-[60vh] min-h-[400px]">
          {getImageUrl(movie.backdrop_path, "w1280") ? (
            <Image
              src={getImageUrl(movie.backdrop_path, "w1280")!}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90" />
          
          <div className="relative z-10 h-full flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
              <button
                onClick={() => router.back()}
                className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                <span>•</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Movie Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-200">
                {getImageUrl(movie.poster_path) ? (
                  <Image
                    src={getImageUrl(movie.poster_path)!}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <div className="text-center p-4">
                      <svg className="w-16 h-16 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">No Image Available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{movie.overview}</p>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-[#8B0000]/10 text-[#8B0000] rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {movie.status && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Status</h4>
                    <p className="text-gray-600">{movie.status}</p>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Budget</h4>
                    <p className="text-gray-600">${movie.budget.toLocaleString()}</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Revenue</h4>
                    <p className="text-gray-600">${movie.revenue.toLocaleString()}</p>
                  </div>
                )}
                {movie.vote_count > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Votes</h4>
                    <p className="text-gray-600">{movie.vote_count.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Production Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.map((company) => (
                      <span
                        key={company.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
