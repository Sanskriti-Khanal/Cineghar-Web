"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 0, 0, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Your Ultimate
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#A00000]">
                  Movie Destination
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover, stream, and enjoy the best movies from around the world. 
                Curated collections, personalized recommendations, and seamless streaming.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/movies"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white font-semibold text-base hover:shadow-2xl hover:shadow-[#8B0000]/50 transition-all duration-300 hover:scale-105"
              >
                Explore Movies
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-sm text-gray-400 mt-1">Movies</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-sm text-gray-400 mt-1">Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4.8★</p>
                <p className="text-sm text-gray-400 mt-1">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Movie Cards Stack */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-md mx-auto">
              {/* Main Movie Card */}
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="flex-1 mx-4 h-10 rounded-full bg-gray-100"></div>
                </div>
                
                <div className="mb-4">
                  <p className="text-base font-semibold text-gray-900 mb-1">
                    Hi, Movie Lover!
                  </p>
                  <p className="text-sm text-gray-500">
                    Welcome back to CineGhar
                  </p>
                </div>

                <div className="h-32 rounded-xl bg-gradient-to-br from-[#8B0000] to-[#A00000] mb-4"></div>

                <div className="flex gap-2 mb-4">
                  <button className="px-4 py-2 rounded-full text-xs font-medium bg-[#8B0000] text-white">
                    Trending
                  </button>
                  <button className="px-4 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    Action
                  </button>
                  <button className="px-4 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    Drama
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        The Dark Knight
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Action • Thriller
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#8B0000]/10 text-[#8B0000] font-medium">
                      4.9★
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Inception
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Sci-Fi • Mystery
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#8B0000]/10 text-[#8B0000] font-medium">
                      4.8★
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Card */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-4 shadow-xl transform rotate-6 w-48 hover:rotate-0 transition-transform duration-300">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Featured Movie
                </p>
                <div className="h-24 rounded-lg bg-gradient-to-br from-[#8B0000] to-[#A00000] mb-3"></div>
                <div className="h-2 rounded bg-gray-200 mb-2"></div>
                <div className="h-2 rounded bg-gray-200 w-3/4 mb-3"></div>
                <button className="w-full h-8 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white text-xs font-medium">
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
