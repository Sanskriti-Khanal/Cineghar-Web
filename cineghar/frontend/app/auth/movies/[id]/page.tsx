"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { getMovieByIdApi, getPosterUrl } from "@/lib/api/publicMovies";
import type { CinegharMovie } from "@/lib/api/publicMovies";
import Image from "next/image";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [movie, setMovie] = useState<CinegharMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid movie ID");
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMovieByIdApi(id);
        if (res.success && res.data) {
          setMovie(res.data);
        } else {
          setError(res.message || "Movie not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050509] text-white">
          <Navbar />
          <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !movie) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050509] text-white">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg">
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

  const posterSrc = getPosterUrl(movie.posterUrl);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050509] text-white">
        <Navbar />

        {/* Hero with poster as background */}
        <div className="relative min-h-[50vh] pt-20">
          {posterSrc ? (
            <>
              <Image
                src={posterSrc}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
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
              <span>⭐ {movie.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
              {movie.releaseDate && (
                <>
                  <span>•</span>
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10">
                {posterSrc ? (
                  <Image
                    src={posterSrc}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center p-4 text-gray-400">
                      No poster
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
                {movie.description}
              </p>

              {movie.genre?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 bg-[#8B0000]/30 text-red-200 rounded-full text-sm border border-[#8B0000]/50"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Duration</h4>
                  <p>{movie.duration} min</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Rating</h4>
                  <p>{movie.rating}/10</p>
                </div>
                {movie.language && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Language</h4>
                    <p>{movie.language}</p>
                  </div>
                )}
                {movie.releaseDate && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Release</h4>
                    <p>
                      {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white font-semibold hover:shadow-lg transition-shadow">
                  Book Now
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-lg border border-white/30 text-white/90 hover:bg-white/10 transition-colors"
                >
                  Back to Movies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
