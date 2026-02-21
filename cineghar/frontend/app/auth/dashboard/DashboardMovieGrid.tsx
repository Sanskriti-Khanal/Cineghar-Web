"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getMoviesApi, getPosterUrl, type CinegharMovie } from "@/lib/api/publicMovies";
import { Star } from "lucide-react";

export default function DashboardMovieGrid() {
  const [movies, setMovies] = useState<CinegharMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMoviesApi({ page: 1, limit: 4 })
      .then((res) => {
        if (!cancelled && res.data?.length) setMovies(res.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-52 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-gray-400">
        No movies yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {movies.map((movie) => {
        const posterSrc = getPosterUrl(movie.posterUrl);
        return (
          <Link
            key={movie._id}
            href={`/auth/movies/${movie._id}`}
            className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.75)] hover:translate-y-[-2px] hover:border-[#8B0000]/70 transition-all duration-200"
          >
            <div className="relative h-40 bg-gradient-to-br from-[#111827] to-[#0b0b11]">
              {posterSrc ? (
                <Image
                  src={posterSrc}
                  alt={movie.title}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8B0000] via-[#1f2937] to-[#111827] opacity-60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold line-clamp-2">{movie.title}</p>
                  <p className="text-[11px] text-gray-200">
                    {movie.genre?.length ? movie.genre.join(" • ") : "—"}
                    {movie.language ? ` • ${movie.language}` : ""}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-[11px]">
                  <Star size={14} className="text-yellow-300" />
                  {movie.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <p className="text-xs text-gray-300">{movie.duration} min</p>
              <span className="text-[11px] px-3 py-1 rounded-full border border-white/20 text-white/90 group-hover:bg-white/10 transition-colors">
                View Details
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
