"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function HeroSection() {
  return (
    <ScrollReveal>
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#f5f8ec] via-[#fdfdfb] to-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e2ebd5] bg-[#f4f8eb] text-[#6a8c3f] text-xs font-medium">
              <span>🎬</span>
              <span>Movies • Entertainment • Streaming</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#222427]">
              Your ultimate movie destination, right at your fingertips.
            </h1>
            
            <p className="text-base text-[#6f7478] max-w-lg">
              CineGhar brings you the latest movies, exclusive content, and personalized recommendations 
              in one simple platform. Watch, discover, and enjoy cinema like never before.
            </p>
            
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/movies"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Explore Movies
              </Link>
              <p className="text-xs text-[#6f7478]">
                Join thousands of movie lovers discovering new favorites every day.
              </p>
            </div>
          </div>

          {/* Hero Visual - Movie Cards Mockup */}
          <div className="relative flex justify-center items-center md:order-2">
            <div className="relative w-full max-w-sm scale-90 md:scale-100">
              {/* Primary Movie Card */}
              <div className="absolute inset-0 transform -rotate-3 -translate-x-2 bg-white rounded-[34px] p-4 shadow-2xl border border-[#d3d8c5] hidden md:block">
                <div className="flex gap-1 mb-3">
                  <div className="w-1 h-1 rounded-full bg-[#d3d7c5]"></div>
                  <div className="w-1 h-1 rounded-full bg-[#d3d7c5]"></div>
                  <div className="w-1 h-1 rounded-full bg-[#d3d7c5]"></div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium">Hi, Movie Lover! 👋</p>
                  <p className="text-xs text-[#6f7478]">Welcome back to CineGhar</p>
                </div>
                <div className="h-8 rounded-full bg-[#f4f6ee] mb-3"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full text-xs bg-[#f4f6ee] text-[#6f7478]">Trending</span>
                  <span className="px-2.5 py-1 rounded-full text-xs bg-white border border-[#ecefdf] text-[#6f7478]">Action</span>
                  <span className="px-2.5 py-1 rounded-full text-xs bg-white border border-[#ecefdf] text-[#6f7478]">Drama</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#fbfbf6] border border-[#ecefdf]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f4e2d8] to-[#ba5370]"></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">The Dark Knight</p>
                      <p className="text-[10px] text-[#6f7478]">Action • Thriller</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#e2ebd5] text-[#6a8c3f] font-medium">4.9★</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#fbfbf6] border border-[#ecefdf]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d1b27c] to-[#f7efe6]"></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">Inception</p>
                      <p className="text-[10px] text-[#6f7478]">Sci-Fi • Mystery</p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#e2ebd5] text-[#6a8c3f] font-medium">4.8★</span>
                  </div>
                </div>
              </div>
              
              {/* Secondary Movie Card */}
              <div className="absolute top-12 right-0 transform rotate-6 translate-x-24 w-48 h-72 rounded-[28px] p-3.5 bg-[#f6f7f1] shadow-xl border border-[#d3d8c5] hidden lg:block">
                <div className="text-xs font-medium mb-2.5">Featured Movie</div>
                <div className="h-20 rounded-lg bg-[#e1e6d4] mb-2"></div>
                <div className="h-4 rounded bg-[#e1e6d4] mb-1.5"></div>
                <div className="h-4 rounded bg-[#e1e6d4] w-3/4 mb-3"></div>
                <div className="h-7 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </ScrollReveal>
  );
}

